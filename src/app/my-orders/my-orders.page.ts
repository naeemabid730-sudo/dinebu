import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { 
  IonContent, 
  IonIcon, 
  IonFooter, 
  IonHeader, 
  IonToolbar,
  IonButtons,
  IonTitle,
  IonSpinner,
  IonBadge,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonButton
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { 
  homeOutline, 
  restaurantOutline, 
  bagOutline, 
  receipt, 
  receiptOutline, 
  personOutline, 
  searchOutline, 
  locationOutline,
  refreshOutline,
  calendarClearOutline,
  chevronBackOutline,
  timeOutline,
  calendarOutline
} from 'ionicons/icons';

// ✅ Firebase Imports
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";

// ✅ Firebase Imports
import { db } from '../../firebase.config';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.page.html',
  styleUrls: ['./my-orders.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonIcon, IonFooter, IonHeader, IonToolbar, 
    IonButtons, IonTitle, IonSpinner, IonBadge, IonCard,
    IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent,
    IonButton, CommonModule, FormsModule
  ]
})
export class MyOrdersPage implements OnInit {

  orders: any[] = [];
  isLoading: boolean = true;
  cartCount: number = 5;

  constructor(private router: Router) {
    // Sab icons register kar liye hain
    addIcons({
      homeOutline, restaurantOutline, bagOutline, receipt,
      receiptOutline, personOutline, searchOutline, locationOutline,
      refreshOutline, calendarClearOutline, chevronBackOutline,
      timeOutline, calendarOutline
    });
  }

  ngOnInit() {
    this.loadMyOrders();
  }

  /**
   * ✅ Security Guard: Check if account exists
   */
  ionViewWillEnter() {
    const isAccountCreated = localStorage.getItem('isAccountCreated') === 'true';
    if (!isAccountCreated) {
      console.log('Access Denied: Account not created');
      this.router.navigate(['/sign-in']); 
    } else {
      this.loadMyOrders(); // Page enter hote hi refresh karein
    }
  }

  /**
   * ✅ Firebase se Orders load karna
   */
  async loadMyOrders() {
    this.isLoading = true;
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      this.orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      this.isLoading = false;
    } catch (error) {
      console.error("Error loading orders: ", error);
      this.isLoading = false;
    }
  }

  /**
   * Navigation Functions
   */
  goToOrderDetails(order: any) {
    this.router.navigate(['/order-details'], {
      state: { orderData: order }
    });
  }

  trackOrder(event: Event) {
    event.stopPropagation(); 
    this.router.navigate(['/order-tracking']); 
  }

  reOrder(event: Event, order: any) {
    event.stopPropagation();
    // Puraane order se pehla item le kar cart mein bhej raha hoon example ke liye
    const reorderProduct = {
      id: Date.now(), 
      name: order.items[0]?.name || 'Product',
      price: order.items[0]?.price || 0,
      qty: order.items[0]?.qty || 1, 
      img: order.items[0]?.img || 'assets/g (1).png'
    };

    this.router.navigate(['/my-cart'], {
      state: { product: reorderProduct }
    });
  }

  goToPage(path: string) {
    this.router.navigate([path]);
  }

  goBack() {
    window.history.back();
  }
}