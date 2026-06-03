import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  sendSignInLinkToEmail 
} from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline } from 'ionicons/icons';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class CreateAccountPage {
  private auth = inject(Auth);
  private router = inject(Router);

  signupData = { email: '', password: '' };
  isLoading = false;

  constructor() {
    // Icons register karna zaroori hai taake error na aaye
    addIcons({ mailOutline, lockClosedOutline });
  }

  async onCreateAccount() {
    if (!this.signupData.email || this.signupData.password.length < 6) {
      alert('Sahi email aur 6-digit se bada password daalein.');
      return;
    }

    this.isLoading = true;

    try {
      // 1. User create karne ki koshish
      await createUserWithEmailAndPassword(this.auth, this.signupData.email, this.signupData.password);
      await this.sendEmailVerificationLink();
    } catch (e: any) {
      // 2. Agar user pehle se hai, toh sirf link bhej dein
      if (e.code === 'auth/email-already-in-use') {
        await this.sendEmailVerificationLink();
      } else {
        alert('Error: ' + e.message);
      }
    } finally {
      this.isLoading = false;
    }
  }

  private async sendEmailVerificationLink() {
    const actionCodeSettings = {
      // URL wahi jo Firebase Console mein "Authorized Domains" mein hai
      url: 'http://localhost:8101/home', 
      handleCodeInApp: true,
    };

    await sendSignInLinkToEmail(this.auth, this.signupData.email, actionCodeSettings);
    // Email save kar lein taake login verify ho sake
    window.localStorage.setItem('emailForSignIn', this.signupData.email);
    
    alert('✅ Verification link aapki email par bhej diya gaya hai. Check karein!');
  }
}