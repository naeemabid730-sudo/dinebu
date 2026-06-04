import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithPopup,
  signInWithCredential,
  signInWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
} from '@angular/fire/auth';
import { addIcons } from 'ionicons';
import {
  logoGoogle, logoFacebook, eyeOutline, eyeOffOutline,
  qrCodeOutline, mailOutline, lockClosedOutline,
  shieldCheckmarkOutline, logoLinkedin
} from 'ionicons/icons';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { FacebookLogin } from '@capacitor-community/facebook-login';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class AccountPage implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);
  private authService = inject(AuthService);

  email = '';
  password = '';
  isLoading = false;
  showPassword = false;
  showPasswordForm = false;

  otp = '';
  generatedOTP = '';
  otpSent = false;
  otpExpiry: number = 0;
  resendCooldown = 0;
  private resendTimer: any;

  // ========== LinkedIn Config ==========
  private linkedinClientId = '7884ug1isb9wug';
  private linkedinRedirectUri = 'https://ravishing-expression-production-393f.up.railway.app';

  constructor() {
    addIcons({
      logoGoogle, logoFacebook, eyeOutline, eyeOffOutline,
      qrCodeOutline, mailOutline, lockClosedOutline,
      shieldCheckmarkOutline, logoLinkedin
    });
  }

  async ngOnInit() {
    // LinkedIn OAuth callback handle karo
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const savedState = localStorage.getItem('linkedin_state');

    if (code && state && state === savedState) {
      this.isLoading = true;
      try {
        const response = await fetch(`${this.linkedinRedirectUri}/auth/linkedin/callback?code=${code}&redirect_uri=${encodeURIComponent(this.linkedinRedirectUri)}`);
        const data = await response.json();
        if (data.name || data.email) {
          localStorage.setItem('isAccountCreated', 'true');
          localStorage.setItem('userName', data.name || 'LinkedIn User');
          localStorage.setItem('userEmail', data.email || '');
          localStorage.setItem('userPhoto', data.picture || '');
        } else {
          localStorage.setItem('isAccountCreated', 'true');
          localStorage.setItem('userName', 'LinkedIn User');
        }
        localStorage.removeItem('linkedin_state');
        this.router.navigate(['/home']);
      } catch (e) {
        localStorage.setItem('isAccountCreated', 'true');
        localStorage.setItem('userName', 'LinkedIn User');
        localStorage.removeItem('linkedin_state');
        this.router.navigate(['/home']);
      } finally {
        this.isLoading = false;
      }
      return;
    }

    // Google redirect result check
    try {
      const result = await this.authService.getGoogleRedirectResult();
      if (result?.user) {
        localStorage.setItem('isAccountCreated', 'true');
        localStorage.setItem('userName', result.user.displayName || 'User');
        localStorage.setItem('userEmail', result.user.email || '');
        localStorage.setItem('userPhoto', result.user.photoURL || '');
        this.router.navigate(['/profile']);
      }
    } catch (e) {
      console.error('Redirect check error:', e);
    }
  }

  async handleLogin() {
    if (!this.email) {
      alert('Email enter karein');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      alert('❌ Sahi email format enter karein');
      return;
    }
    this.isLoading = true;
    try {
      this.generatedOTP = this.authService.generateOTP();
      this.otpExpiry = Date.now() + 5 * 60 * 1000;
      const sent = await this.authService.sendOTPEmail(this.email, this.generatedOTP);
      if (sent) {
        this.otpSent = true;
        this.showPasswordForm = false;
        this.startResendCooldown();
      } else {
        alert('❌ OTP email nahi gayi — dobara try karein');
      }
    } catch (e: any) {
      alert('❌ Error: ' + e.message);
    } finally {
      this.isLoading = false;
    }
  }

  async verifyOTP() {
    const otpStr = this.otp?.toString().trim();
    if (!otpStr || otpStr.length !== 6) {
      alert('6-digit OTP enter karein');
      return;
    }
    if (Date.now() > this.otpExpiry) {
      alert('⚠️ OTP expire ho gaya! Dobara login karein');
      this.resetOTPState();
      return;
    }
    if (otpStr === this.generatedOTP) {
      this.clearResendTimer();
      localStorage.setItem('isAccountCreated', 'true');
      localStorage.setItem('userEmail', this.email);
      this.router.navigate(['/home']);
    } else {
      alert('❌ Galat OTP! Dobara check karein');
      this.otp = '';
    }
  }

  async handlePasswordLogin() {
    if (!this.email || !this.password) {
      alert('Email aur Password dono enter karein');
      return;
    }
    this.isLoading = true;
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      localStorage.setItem('isAccountCreated', 'true');
      localStorage.setItem('userEmail', this.email);
      this.router.navigate(['/home']);
    } catch (e: any) {
      const errors: Record<string, string> = {
        'auth/user-not-found':     '❌ Email registered nahi hai',
        'auth/wrong-password':     '❌ Password galat hai',
        'auth/invalid-credential': '❌ Email ya Password galat hai',
        'auth/too-many-requests':  '⚠️ Zyada attempts — thodi der baad try karein',
        'auth/invalid-email':      '❌ Email format sahi nahi hai',
        'auth/user-disabled':      '❌ Account disable kar diya gaya hai',
      };
      alert(errors[e.code] || '❌ Error: ' + e.message);
    } finally {
      this.isLoading = false;
    }
  }

  async resendOTP() {
    if (this.resendCooldown > 0) return;
    this.isLoading = true;
    try {
      this.generatedOTP = this.authService.generateOTP();
      this.otpExpiry = Date.now() + 5 * 60 * 1000;
      const sent = await this.authService.sendOTPEmail(this.email, this.generatedOTP);
      if (sent) {
        this.otp = '';
        this.startResendCooldown();
        alert('✅ Naya OTP bheja gaya!');
      } else {
        alert('❌ OTP dobara nahi gayi');
      }
    } catch (e: any) {
      alert('❌ Error: ' + e.message);
    } finally {
      this.isLoading = false;
    }
  }

  private startResendCooldown() {
    this.resendCooldown = 30;
    this.clearResendTimer();
    this.resendTimer = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) this.clearResendTimer();
    }, 1000);
  }

  private clearResendTimer() {
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
      this.resendTimer = null;
    }
  }

  private resetOTPState() {
    this.otpSent = false;
    this.otp = '';
    this.generatedOTP = '';
    this.otpExpiry = 0;
    this.clearResendTimer();
    this.resendCooldown = 0;
  }

  // ========== GOOGLE / FACEBOOK / LINKEDIN ==========
  async loginSocial(type: string) {
    this.isLoading = true;

    // ✅ LinkedIn Login — r_liteprofile r_emailaddress scope (valid scopes)
    if (type === 'linkedin') {
      const state = Math.random().toString(36).substring(7);
      localStorage.setItem('linkedin_state', state);
      const scope = encodeURIComponent('r_liteprofile r_emailaddress');
      const redirectUri = encodeURIComponent(this.linkedinRedirectUri);
      const linkedinUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${this.linkedinClientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
      window.location.href = linkedinUrl;
      return;
    }

    try {
      if (type === 'google') {
        if (Capacitor.isNativePlatform()) {
          await GoogleAuth.initialize();
          const googleUser: any = await GoogleAuth.signIn();
          localStorage.setItem('isAccountCreated', 'true');
          localStorage.setItem('userName', googleUser.displayName || googleUser.name || 'User');
          localStorage.setItem('userEmail', googleUser.email || '');
          localStorage.setItem('userPhoto', googleUser.imageUrl || googleUser.picture || '');
          this.isLoading = false;
          this.router.navigate(['/profile']);
        } else {
          const result = await this.authService.loginWithGoogle();
          if (result?.user) {
            localStorage.setItem('isAccountCreated', 'true');
            localStorage.setItem('userName', result.user.displayName || 'User');
            localStorage.setItem('userEmail', result.user.email || '');
            localStorage.setItem('userPhoto', result.user.photoURL || '');
            this.isLoading = false;
            this.router.navigate(['/profile']);
          }
        }

      } else if (type === 'facebook') {
        if (Capacitor.isNativePlatform()) {
          const result = await FacebookLogin.login({
            permissions: ['email', 'public_profile']
          });
          if (result.accessToken) {
            const credential = FacebookAuthProvider.credential(result.accessToken.token);
            const firebaseResult = await signInWithCredential(this.auth, credential);
            localStorage.setItem('isAccountCreated', 'true');
            localStorage.setItem('userName', firebaseResult.user.displayName || 'User');
            localStorage.setItem('userEmail', firebaseResult.user.email || '');
            localStorage.setItem('userPhoto', firebaseResult.user.photoURL || '');
            this.isLoading = false;
            this.router.navigate(['/home']);
          } else {
            this.isLoading = false;
            alert('❌ Facebook login cancel hua');
          }
        } else {
          try { await this.auth.signOut(); } catch (e) {}
          const provider = new FacebookAuthProvider();
          provider.addScope('email');
          provider.addScope('public_profile');
          provider.setCustomParameters({ auth_type: 'rerequest' });
          const result = await signInWithPopup(this.auth, provider);
          localStorage.setItem('isAccountCreated', 'true');
          localStorage.setItem('userName', result.user.displayName || 'User');
          localStorage.setItem('userEmail', result.user.email || '');
          localStorage.setItem('userPhoto', result.user.photoURL || '');
          this.isLoading = false;
          this.router.navigate(['/home']);
        }
      }
    } catch (e: any) {
      this.isLoading = false;
      if (e.code === 'auth/popup-blocked') {
        alert('⚠️ Popup block hua — browser mein popup allow karo');
      } else if (
        e.code === 'auth/popup-closed-by-user' ||
        e.code === 'auth/cancelled-popup-request'
      ) {
        // silent
      } else if (e.code === 'auth/unauthorized-domain') {
        alert('❌ Domain authorized nahi — Firebase Console mein localhost add karo');
      } else if (e.code === 'auth/missing-or-invalid-nonce') {
        alert('⚠️ Browser cache clear karo aur dobara try karo');
      } else {
        alert('❌ Error: ' + e.message);
      }
    }
  }

  togglePassword() { this.showPassword = !this.showPassword; }
  togglePasswordForm() {
    this.showPasswordForm = !this.showPasswordForm;
    this.password = '';
  }

  goBackToLogin() {
    this.resetOTPState();
    this.showPasswordForm = false;
    this.password = '';
  }

  async scanQR() {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        document.querySelector('body')?.classList.add('scanner-active');
        await BarcodeScanner.hideBackground();
        const result = await BarcodeScanner.startScan();
        if (result.hasContent) alert('Scanned: ' + result.content);
        document.querySelector('body')?.classList.remove('scanner-active');
        BarcodeScanner.showBackground();
      } else {
        alert('Camera permission denied!');
      }
    } catch (error) {
      document.querySelector('body')?.classList.remove('scanner-active');
      BarcodeScanner.showBackground();
    }
  }

  create() { this.router.navigate(['/create-account']); }
  goToSignup() { this.create(); }
  goBack() { window.history.back(); }
}