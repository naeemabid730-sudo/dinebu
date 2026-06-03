import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  getRedirectResult,
  GoogleAuthProvider,
  UserCredential
} from '@angular/fire/auth';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);

  private readonly SERVICE_ID  = 'service_9ulyafa';
  private readonly TEMPLATE_ID = 'template_4fi4wxo'; // ✅ SAHI TEMPLATE ID
  private readonly PUBLIC_KEY  = 'py27F5wfximhvkFL8';

  // ========== GOOGLE LOGIN ==========
  async loginWithGoogle(): Promise<UserCredential | null> {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({ prompt: 'select_account' });
    return await signInWithPopup(this.auth, provider);
  }

  // ========== REDIRECT RESULT ==========
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

  // ========== OTP EMAIL ==========
  async sendOTPEmail(email: string, otp: string): Promise<boolean> {
    try {
      console.log('📧 Sending OTP to:', email, '| OTP:', otp);

      emailjs.init(this.PUBLIC_KEY);

      const result = await emailjs.send(
        this.SERVICE_ID,
        this.TEMPLATE_ID,
        {
          to_email: email,
          passcode: otp,
          app_name: 'DineBux',
          time:     '5 minutes'
        }
      );

      console.log('✅ EmailJS Success:', result.status, result.text);
      return result.status === 200;

    } catch (error: any) {
      console.error('❌ EmailJS Error:', JSON.stringify(error));
      return false;
    }
  }
}