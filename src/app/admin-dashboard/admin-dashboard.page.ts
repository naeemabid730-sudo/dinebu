import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonList, IonItem, IonLabel, IonBadge, IonIcon, 
  IonButtons, IonButton, IonGrid, IonRow, IonCol,
  IonModal, IonSegment, IonSegmentButton, IonInput, IonTextarea, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  restaurantOutline, receiptOutline, peopleOutline, 
  cartOutline, checkmarkCircle, settingsOutline,
  fastFoodOutline, personCircleOutline, walletOutline, 
  bagCheckOutline, locationOutline, trendingUpOutline, mailOutline, sendOutline, personOutline
} from 'ionicons/icons';

// ✅ Firebase Imports
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc } from "firebase/firestore";

// ✅ Centralized Firebase db Import
import { db } from '../../firebase.config';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonList, IonItem, IonLabel, IonBadge, IonIcon, 
    IonButtons, IonButton, IonGrid, IonRow, IonCol,
    IonModal, IonSegment, IonSegmentButton, IonInput, IonTextarea
  ]
})
export class AdminDashboardPage implements OnInit {
  
  currentTab: string = 'overview'; 

  totalOrders: number = 0;
  totalRevenue: number = 0;
  estimatedProfit: number = 0; 
  pendingOrdersCount: number = 0;
  recentOrders: any[] = []; 
  
  allUsers: any[] = [];

  broadcastTitle: string = '';
  broadcastMessage: string = '';

  isModalOpen: boolean = false;
  selectedOrder: any = null;

  constructor(private router: Router, private toastCtrl: ToastController) {
    addIcons({ 
      restaurantOutline, receiptOutline, peopleOutline, cartOutline, checkmarkCircle, settingsOutline,
      fastFoodOutline, personCircleOutline, walletOutline, bagCheckOutline, locationOutline, 
      trendingUpOutline, mailOutline, sendOutline, personOutline
    });
  }

  ngOnInit() {
    this.listenToRealtimeOrders(); 
    this.listenToUsers();          
  }

  // ✅ PERFECTED FUNCTION: Live Orders + Toast + Error Catching
  listenToRealtimeOrders() {
    console.log("Admin Dashboard: Orders lana shuru kar raha hoon...");
    
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      
      onSnapshot(q, (snapshot) => {
        console.log("Admin Dashboard: Firebase se data mil gaya!", snapshot.docs.length, "orders");

        // New Order Notification Logic
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added" && this.recentOrders.length > 0) {
             this.showNewOrderToast(change.doc.data()['customerName']);
          }
        });

        // Store Orders
        this.recentOrders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Stats Update
        this.totalOrders = this.recentOrders.length;
        this.totalRevenue = this.recentOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        this.estimatedProfit = (this.totalRevenue * 0.30); 
        this.pendingOrdersCount = this.recentOrders.filter(o => o.status === 'Pending').length;
        
      }, (error) => {
        console.error("Admin Dashboard Snapshot Error:", error);
        alert("Admin Panel Firebase Error: " + error.message);
      });

    } catch (error: any) {
      console.error("Admin Dashboard Query Error:", error);
      alert("System Error: " + error.message);
    }
  }

  listenToUsers() {
    const q = query(collection(db, "users")); 
    onSnapshot(q, (snapshot) => {
      this.allUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    });
  }

  async sendBroadcast() {
    if (!this.broadcastTitle || !this.broadcastMessage) {
      this.showToast('Please fill both title and message.', 'danger');
      return;
    }

    try {
      await addDoc(collection(db, "broadcast_messages"), {
        title: this.broadcastTitle,
        message: this.broadcastMessage,
        createdAt: new Date().toISOString()
      });

      this.broadcastTitle = '';
      this.broadcastMessage = '';
      this.showToast('Message sent to all users successfully!', 'success');
      
    } catch (error) {
      console.error("Broadcast Error: ", error);
      this.showToast('Failed to send broadcast.', 'danger');
    }
  }

  async markAsDelivered(docId: string) {
    try {
      const orderRef = doc(db, "orders", docId);
      await updateDoc(orderRef, { status: "Delivered" });
      this.closeModal();
      this.showToast('Order marked as Delivered!', 'success');
    } catch (error) {
      console.error("Status Update Error:", error);
    }
  }

  viewOrderDetails(order: any) {
    this.selectedOrder = order;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedOrder = null;
  }

  goToPage(path: string) {
    this.router.navigate([path]);
  }

  async showToast(msg: string, clr: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2500,
      color: clr,
      position: 'bottom'
    });
    await toast.present();
  }

  async showNewOrderToast(customerName: string) {
    const toast = await this.toastCtrl.create({
      message: `🔔 New Order Received from ${customerName}!`,
      duration: 4000,
      color: 'warning',
      position: 'top',
      buttons: [{ text: 'View', role: 'cancel' }]
    });
    await toast.present();
  }
}