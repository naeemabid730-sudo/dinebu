import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, cashOutline, walletOutline, cardOutline, 
  checkmarkCircle, mapOutline, logoWhatsapp, downloadOutline, 
  checkmarkDoneCircle, receiptOutline, bicycleOutline, locationOutline,
  personOutline, businessOutline, fastFoodOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PaymentPage implements OnInit {
  selectedMethod: string = 'COD';
  selectedWallet: any = null;
  subtotal: number = 0;
  shipping: number = 0;
  totalCost: number = 0;
  showReceipt: boolean = false;
  orderId: string = '';
  
  // Shipping aur Address variables
  shippingMethod: string = '';
  displayAddress: any = null;

  // --- NEW VARIABLES FOR MODAL ---
  userName: string = 'Ahmad'; // Aap ise localStorage se bhi utha saktay hain
  userPhone: string = '0300-1234567'; // User contact info
  pickupAddress: string = 'DineBux Main Kitchen, Pakpattan'; 
  returnAddress: string = 'DineBux Hub, Punjab, Pakistan';
  cartItems: any[] = []; // Modal mein items dikhanay ke liye

  wallets = [
    { key: 'jazzcash', name: 'JazzCash', logo: '../../assets/jazzcash.png' },
    { key: 'easypaisa', name: 'EasyPaisa', logo: '../../assets/easypaisa.webp' }
  ];

  constructor(private router: Router) {
    addIcons({ 
      arrowBackOutline, cashOutline, walletOutline, cardOutline, 
      checkmarkCircle, mapOutline, logoWhatsapp, downloadOutline,
      checkmarkDoneCircle, receiptOutline, bicycleOutline, locationOutline,
      personOutline, businessOutline, fastFoodOutline
    });
  }

  ngOnInit() {
    this.orderId = 'DNBX-' + Math.floor(100000 + Math.random() * 900000);
    this.loadCheckoutData();
  }

  loadCheckoutData() {
    // 1. Shipping Method
    this.shippingMethod = localStorage.getItem('shippingMethod') || 'Standard';

    // 2. Selected Delivery Address
    const savedAddress = localStorage.getItem('selectedAddress');
    if (savedAddress) {
      this.displayAddress = JSON.parse(savedAddress);
    }

    // 3. Totals (Subtotal, Shipping, Total)
    const savedTotals = localStorage.getItem('checkoutTotals');
    if (savedTotals) {
      const totals = JSON.parse(savedTotals);
      this.subtotal = totals.subtotal || 0;
      this.shipping = totals.shipping || 0;
      this.totalCost = totals.total || 0;
    }

    // 4. Cart Items (Modal mein summary dikhanay ke liye)
    const savedCart = localStorage.getItem('user_cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
    }

    // 5. User Profile (Agar login info save hai toh wahan se naam uthayein)
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      const profile = JSON.parse(userProfile);
      this.userName = profile.name || this.userName;
      this.userPhone = profile.phone || this.userPhone;
    }
  }

  onMethodChange(event: any) {
    this.selectedMethod = event.detail.value;
    if (this.selectedMethod !== 'wallet') {
      this.selectedWallet = null;
    }
  }

  chooseWallet(w: any) {
    this.selectedWallet = w;
  }

  payNow() {
    if (this.selectedMethod === 'wallet' && !this.selectedWallet) {
      alert("Please select a wallet (JazzCash/EasyPaisa)");
      return;
    }
    
    // Order place hotay hi hum receipt show kar daitay hain
    this.showReceipt = true;
    
    // Yahan aap cart clear karne ka logic bhi daal saktay hain agar zaroorat ho
    // localStorage.removeItem('user_cart');
  }

  goToOrderStatus() {
    this.showReceipt = false;
    setTimeout(() => {
      this.router.navigate(['/order-status'], { queryParams: { id: this.orderId } });
    }, 300);
  }

  closeReceipt() {
    this.showReceipt = false;
    this.router.navigate(['/home']);
  }

  goBack() { 
    window.history.back(); 
  } 
}