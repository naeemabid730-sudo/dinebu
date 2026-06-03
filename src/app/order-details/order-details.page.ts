import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonIcon, 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonBackButton,
  IonTitle
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, 
  timeOutline, 
  receiptOutline, 
  calendarOutline, 
  bagOutline, 
  storefrontOutline, 
  cardOutline, 
  fastFoodOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-order-details',
  standalone: true,
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
  imports: [
    CommonModule, 
    IonContent, 
    IonIcon,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle
  ]
})
export class OrderDetailsPage implements OnInit {

  order: any;

  constructor(private router: Router) {
    // Sabhi icons ko yahan register kiya gaya hai
    addIcons({
      arrowBackOutline,
      timeOutline,
      receiptOutline,
      calendarOutline,
      bagOutline,
      storefrontOutline,
      cardOutline,
      fastFoodOutline
    });

    // Previous page se aane wala data receive karna
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['orderData']) {
      this.order = navigation.extras.state['orderData'];
      console.log('Order Data Received:', this.order);
    }
  }

  ngOnInit() {
    // Agar data na mile toh console par warning aaye
    if (!this.order) {
      console.warn('No order data found in navigation state');
    }
  }

  goBack() {
    // Wapas My Orders page par le jane ke liye
    this.router.navigate(['/my-orders']);
  }
}