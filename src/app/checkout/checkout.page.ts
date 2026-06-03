import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, IonHeader, IonIcon, IonFooter, IonDatetime, 
  IonModal, IonToolbar, IonTitle, IonButtons, IonButton, 
  IonList, IonItem, IonLabel, AlertController, LoadingController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, locationOutline, personOutline, mailOutline, 
  callOutline, homeOutline, calendarOutline, timeOutline, 
  checkmarkCircle, closeOutline, chevronDownOutline, chevronForwardOutline,
  bicycleOutline, storefrontOutline, documentTextOutline, receiptOutline,
  person, call, location, calendar, time, mail, checkmarkDoneOutline, arrowForwardOutline, map
} from 'ionicons/icons';

// 🔥 Firebase imports
import { db } from '../../firebase.config';
import { collection, addDoc } from 'firebase/firestore';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonIcon, IonFooter, IonDatetime, 
    IonModal, IonToolbar, IonTitle, IonButtons, IonButton, 
    IonList, IonItem, IonLabel, CommonModule, FormsModule
  ]
})
export class CheckoutPage implements OnInit {
  orderType: string = 'delivery';
  cartItems: any[] = [];
  totalAmount: number = 0;
  orderId: string = ''; 
  isAreaModalOpen: boolean = false;
  isOrderSuccessful: boolean = false; 

  pakpattanAreas: string[] = [
    'Pakpattan City', 'Green Town', 'Pain wali', 'Al Fareed Garden',
    'Fareed Nager', 'Cachari', 'kameer road', 'Chak 37/SP', 
    'Chak 36/sp', 'Darbar', 'Shahidi Bazar', 'Arifwala Road', 
    'Sahiwal Road', 'Malka Hans', 'Chak 19/SP', 'Chak 56/EB', 
    'Dhaki Ki Chungi', 'Bunga Hayat', 'Noor Pur'
  ];

  selectedDate: string = new Date().toISOString();
  selectedTime: string = new Date().toISOString();
  userDetails = { name: '', email: '', phone: '', area: '', address: '' };

  constructor(
    private router: Router, 
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({ 
      arrowBackOutline, locationOutline, personOutline, mailOutline, 
      callOutline, homeOutline, calendarOutline, timeOutline, 
      checkmarkCircle, closeOutline, chevronDownOutline, chevronForwardOutline,
      bicycleOutline, storefrontOutline, documentTextOutline, receiptOutline,
      person, call, location, calendar, time, checkmarkDoneOutline, arrowForwardOutline, map, mail
    });

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      let rawItems = navigation.extras.state['items'] || [];
      this.totalAmount = navigation.extras.state['totalAmount'] || 0;

      this.cartItems = rawItems.map((item: any) => ({
        ...item,
        image: item.image || item.img 
      }));
    }
  }

  ngOnInit() {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) { this.userDetails = JSON.parse(savedUser); }
  }

  setOrderType(type: string) { this.orderType = type; }
  openAreaModal() { this.isAreaModalOpen = true; }
  selectArea(area: string) { this.userDetails.area = area; this.isAreaModalOpen = false; }
  goBack() { this.router.navigate(['/my-cart']); }

  isFormValid(): boolean {
    const { name, phone, area, address } = this.userDetails;
    const hasBasic = name?.trim().length > 2 && phone?.trim().length > 8;
    if (this.orderType === 'delivery') {
      return !!(hasBasic && area?.trim().length > 0 && address?.trim().length > 0);
    }
    return hasBasic;
  }

  async placeOrder() {
    if (!this.isFormValid()) {
      const alert = await this.alertCtrl.create({
        header: 'Maalomat Adhori Hain',
        message: 'Order confirm karne ke liye apni mukammal detail darj karein.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Processing Your Order...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // ✅ Firestore mein order save karo
      const docRef = await addDoc(collection(db, 'orders'), {
        customer: this.userDetails,
        items: this.cartItems,
        totalAmount: this.totalAmount,
        orderType: this.orderType,
        status: 'pending',
        createdAt: new Date()
      });

      // ✅ Firestore ka real orderId use karo
      this.orderId = docRef.id;

      // ✅ LocalStorage update karo
      const totals = {
        subtotal: this.totalAmount - (this.orderType === 'delivery' ? 150 : 0),
        shipping: (this.orderType === 'delivery' ? 150 : 0),
        total: this.totalAmount
      };

      localStorage.setItem('checkoutTotals', JSON.stringify(totals));
      localStorage.setItem('userData', JSON.stringify(this.userDetails));

      await loading.dismiss();
      this.isOrderSuccessful = true; // ✅ Success screen show hogi

    } catch (error) {
      console.error('❌ Order save error:', error);
      await loading.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Order place nahi hua, internet check karein aur dobara try karein.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  goToShipping() {
    this.isOrderSuccessful = false;
    this.router.navigate(['/shipping']); 
  }

  goToHome() {
    this.isOrderSuccessful = false;
    this.router.navigate(['/menu'], { replaceUrl: true }); 
  }
}