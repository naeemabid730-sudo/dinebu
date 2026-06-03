import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  signInWithCredential,
  getRedirectResult,
  GoogleAuthProvider,
  FacebookAuthProvider,
  UserCredential
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);

  private readonly EMAILJS_SERVICE_ID  = 'service_9ulyafa';
  private readonly EMAILJS_TEMPLATE_ID = 'template_36tjfqa';
  private readonly EMAILJS_PUBLIC_KEY  = 'py27F5wfximhvkFL8';

  // ========== GOOGLE LOGIN (Popup) ==========
  async loginWithGoogle(): Promise<UserCredential | null> {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({ prompt: 'select_account' });
    return await signInWithPopup(this.auth, provider);
  }

  // ========== REDIRECT RESULT (backup) ==========
  async getGoogleRedirectResult(): Promise<UserCredential | null> {
    try {
      return await getRedirectResult(this.auth);
    } catch (e) {
      console.error('Redirect result error:', e);
      return null;
    }
  }

  // ========== OTP GENERATE ==========
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // ========== OTP EMAIL BHEJO (fetch via EmailJS REST API) ==========
  async sendOTPEmail(email: string, otp: string): Promise<boolean> {
    try {
      console.log('📧 OTP bhej raha hoon:', email, '| OTP:', otp);

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id:      this.EMAILJS_SERVICE_ID,
          template_id:     this.EMAILJS_TEMPLATE_ID,
          user_id:         this.EMAILJS_PUBLIC_KEY,
          template_params: {
            to_email: email,
            passcode: otp,
            app_name: 'DineBux',
            time:     '5 minutes'
          }
        })
      });

      if (response.ok) {
        console.log('✅ OTP email bhej di:', email);
        return true;
      } else {
        const errText = await response.text();
        console.error('❌ EmailJS error response:', response.status, errText);
        return false;
      }

    } catch (error: any) {
      console.error('❌ OTP send error:', error);
      return false;
    }
  }
}