import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';

// ✅ Firebase Imports
import { initializeApp } from "firebase/app";
import { 
  getFirestore, collection, addDoc, deleteDoc, 
  doc, updateDoc, query, where, onSnapshot, getDocs 
} from "firebase/firestore";

import Chart from 'chart.js/auto';

// ✅ Centralized Firebase db Import
import { db } from '../../firebase.config';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdminPage implements OnInit {
  @ViewChild('salesChart') salesChartCanvas!: ElementRef;
  chart: any;

  activeTab: string = 'dashboard';
  selectedSegment: string = 'Pending'; 
  
  menuItems: any[] = [];
  filteredOrders: any[] = []; 
  
  totalSales: number = 0;
  totalProfit: number = 0;
  totalLoss: number = 0;

  newItem = { name: '', price: 0, category: 'Fast Food', img: 'assets/g (1).png' };

  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController) {}

  ngOnInit() {
    this.listenToMenu();
    this.getOrdersByStatus('Pending'); 
  }

  ionViewDidEnter() {
    this.createChart();
  }

  /**
   * ✅ 1. Real-time Order Listener
   */
  getOrdersByStatus(status: string) {
    this.selectedSegment = status;
    const q = query(collection(db, "orders"), where("status", "==", status));

    onSnapshot(q, (snapshot) => {
      this.filteredOrders = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      // Data change hote hi dashboard update karein
      this.calculateFinancials();
    });
  }

  /**
   * ✅ 2. Financial Calculations (Fixed & Merged)
   * Ab ye Pending aur Delivered dono ka total dikhayega
   */
  async calculateFinancials() {
    try {
      const q = query(collection(db, "orders"));
      const querySnapshot = await getDocs(q);
      
      let sales = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data() as any;
        // Testing ke liye hum Pending aur Delivered dono ko count kar rahe hain
        if (data.status === 'Delivered' || data.status === 'Pending') {
          sales += data.total || 0;
        }
      });

      this.totalSales = sales;
      this.totalProfit = sales * 0.25; // 25% Profit
      this.totalLoss = sales * 0.05;   // 5% Loss
      
      this.createChart();
    } catch (error) {
      console.error("Calculation Error: ", error);
    }
  }

  onSegmentChange(ev: any) {
    this.getOrdersByStatus(ev.detail.value);
  }

  async updateOrderStatus(orderId: string, newStatus: string) {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      this.showToast('Order marked as ' + newStatus);
    } catch (e) {
      console.error("Update Status Error:", e);
    }
  }

  listenToMenu() {
    onSnapshot(collection(db, "menu"), (snapshot) => {
      this.menuItems = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    });
  }

  async addItem() {
    if (!this.newItem.name || this.newItem.price <= 0) return;
    await addDoc(collection(db, "menu"), this.newItem);
    this.newItem = { name: '', price: 0, category: 'Fast Food', img: 'assets/g (1).png' };
    this.showToast('Item Added to Menu');
  }

  async deleteItem(id: string) {
    await deleteDoc(doc(db, "menu", id));
    this.showToast('Item Deleted');
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000, color: 'dark' });
    toast.present();
  }

  createChart() {
    if (!this.salesChartCanvas || !this.salesChartCanvas.nativeElement) return;
    
    if (this.chart) this.chart.destroy();
    
    this.chart = new Chart(this.salesChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Sales', 'Profit', 'Loss'],
        datasets: [{
          label: 'DineBux Revenue Rs',
          data: [this.totalSales, this.totalProfit, this.totalLoss],
          backgroundColor: ['#3880ff', '#2dd36f', '#eb445a']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  }
}