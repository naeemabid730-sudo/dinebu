import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, timeOutline, checkmarkCircle, 
  bicycleOutline, fastFoodOutline, closeCircleOutline,
  helpCircleOutline, repeatOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.page.html',
  styleUrls: ['./order-status.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class OrderStatusPage implements OnInit {
  // Points 2: Live Tracking Statuses
  currentStatus: number = 1; // 1: Pending, 2: Confirmed, 3: Out for Delivery
  selectedSegment: string = 'active';

  orderId: string = '#DBX-99210'; // Point 4: Record ID
  activeItems: any[] = [];
  subtotal: number = 0;
  deliveryFee: number = 50;

  constructor(
    private router: Router, 
    private alertCtrl: AlertController
  ) {
    addIcons({ 
      arrowBackOutline, timeOutline, checkmarkCircle, 
      bicycleOutline, fastFoodOutline, closeCircleOutline,
      helpCircleOutline, repeatOutline 
    });
  }

  ngOnInit() {
    this.loadOrderData();
  }

  loadOrderData() {
    const data = localStorage.getItem('user_cart');
    if (data) {
      this.activeItems = JSON.parse(data);
      this.calculateTotal();
    }
  }

  calculateTotal() {
    this.subtotal = this.activeItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  }

  // Point 3: Cancel Order Logic
  async cancelOrder() {
    const alert = await this.alertCtrl.create({
      header: 'Cancel Order?',
      message: 'Kya aap waqai apna order cancel karna chahte hain?',
      buttons: [
        { text: 'No', role: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          handler: () => {
            this.activeItems = [];
            console.log('Order Cancelled');
          }
        }
      ]
    });
    await alert.present();
  }

  goBack() { this.router.navigate(['/home']); } 
  goToTracking() {
    console.log('Navigating to tracking page...');
    // 'order-tracking' aapke uss page ka route name hona chahiye jo aapne app-routing.module.ts mein rakha hai
    this.router.navigate(['/order-tracking']); 
  }
}