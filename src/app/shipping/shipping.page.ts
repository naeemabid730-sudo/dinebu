import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.page.html',
  styleUrls: ['./shipping.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ShippingPage {
  selectedMethod: string = 'standard'; 

  constructor(private router: Router) {
    addIcons({ arrowBackOutline });
  }

  // Method select karne ke liye
  selectMethod(method: string) {
    this.selectedMethod = method;
  }

  goBack() {
    window.history.back();
  }

  // Stepper se Address par jane ke liye (Error fix)
  goToAddress() {
    localStorage.setItem('shippingMethod', this.selectedMethod);
    this.router.navigate(['/address']); 
  }

  // Stepper se direct Payment par jane ke liye (Error fix)
  // Note: Isme hum check kar sakte hain ke agar address pehle se saved ho
  goToPayment() {
    localStorage.setItem('shippingMethod', this.selectedMethod);
    this.router.navigate(['/payment']); 
  }

  // Confirm & Continue button ke liye
  goToNext() {
    this.goToAddress(); // Pehle address confirm karwana behtar hai
  }
}