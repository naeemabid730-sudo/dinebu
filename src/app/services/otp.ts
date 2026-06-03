import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OtpService {
  private http = inject(HttpClient);
  private generatedOtp: string = '';
  private otpExpiry: number = 0;

  // ✅ OTP generate karo aur email bhejo
  async sendOtp(email: string): Promise<boolean> {
    this.generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minute expiry

    try {
      // EmailJS se email bhejo — free service
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: 'YOUR_SERVICE_ID',       // ← EmailJS se milega
          template_id: 'YOUR_TEMPLATE_ID',     // ← EmailJS se milega
          user_id: 'YOUR_PUBLIC_KEY',          // ← EmailJS se milega
          template_params: {
            to_email: email,
            otp_code: this.generatedOtp,
            app_name: 'DineBux'
          }
        })
      });

      return response.ok;
    } catch (error) {
      console.error('OTP send error:', error);
      return false;
    }
  }

  // ✅ OTP verify karo
  verifyOtp(enteredOtp: string): boolean {
    if (Date.now() > this.otpExpiry) return false; // Expire check
    return this.generatedOtp === enteredOtp;
  }

  clearOtp() {
    this.generatedOtp = '';
    this.otpExpiry = 0;
  }
}