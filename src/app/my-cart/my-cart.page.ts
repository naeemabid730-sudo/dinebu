import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { 
  IonContent, IonIcon, IonFooter, IonHeader, IonToolbar, IonTitle, 
  IonButtons, AlertController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  trashOutline, addOutline, removeOutline, cartOutline, homeOutline,
  restaurantOutline, bagHandle, receiptOutline, personOutline, 
  chevronBackOutline, arrowForwardOutline, arrowBackOutline, ticketOutline,
  bagHandleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.page.html',
  styleUrls: ['./my-cart.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonIcon, IonFooter, 
    IonHeader, IonToolbar, IonTitle, IonButtons
  ]
})
export class MyCartPage implements OnInit {
  cartItems: any[] = [];
  isLoggedIn: boolean = false;
  couponCode: string = '';
  deliveryFee: number = 150;
  subtotal: number = 0;

  constructor(private router: Router, private alertCtrl: AlertController) {
    addIcons({
      trashOutline, addOutline, removeOutline, cartOutline,
      homeOutline, restaurantOutline, bagHandle, receiptOutline,
      personOutline, chevronBackOutline, arrowForwardOutline,
      arrowBackOutline, ticketOutline, bagHandleOutline
    });

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const state = navigation.extras.state;
      let incomingItems = state['products'] || state['items'] || [];
      let newProduct = state['product'];

      if (newProduct) { this.addToCartLogic(newProduct); }
      if (incomingItems.length > 0) {
        incomingItems.forEach((item: any) => this.addToCartLogic(item));
      }
    }
    this.calculateTotal();
  }

  ngOnInit() {
    this.checkUserStatus();
  }

  checkUserStatus() {
    this.isLoggedIn = localStorage.getItem('isAccountCreated') === 'true';
  }

  addToCartLogic(product: any) {
    const exists = this.cartItems.find(i => i.id === product.id);
    if (exists) {
      exists.qty += (product.qty || 1);
    } else {
      this.cartItems.push({...product, qty: product.qty || 1});
    }
  }

  async increase(item: any) {
    if (item.qty >= 5) {
      const alert = await this.alertCtrl.create({
        header: 'Quantity Limit',
        message: 'Do you want to increase the quantity above 5? This will add a new item card.',
        buttons: [
          { text: 'No', role: 'cancel' },
          { 
            text: 'Yes', 
            handler: () => {
              // Same item ka naya card (New Reference)
              this.cartItems.push({...item, qty: 1, isFreeItemAdded: false});
              this.calculateTotal();
            }
          }
        ]
      });
      await alert.present();
    } else {
      item.qty++;
      item.isFreeItemAdded = false; 
      this.calculateTotal();
    }
  }

  decrease(item: any) {
    if (item.qty > 1) {
      item.qty--;
      item.isFreeItemAdded = false;
    } else {
      this.confirmRemove(item);
    }
    this.calculateTotal();
  }

  async confirmRemove(item: any) {
    const alert = await this.alertCtrl.create({
      header: 'Remove Item',
      message: `${item.name} ko cart se nikal dein?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Remove', handler: () => { this.removeItem(item); }}
      ]
    });
    await alert.present();
  }

  removeItem(item: any) {
    // Index base removal taake agar duplicate IDs hon (different cards), toh sirf wahi delete ho
    const index = this.cartItems.indexOf(item);
    if (index > -1) {
      this.cartItems.splice(index, 1);
    }
    this.calculateTotal();
  }

  calculateTotal() {
    this.subtotal = this.cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  }

  applyCoupon() {
    const code = this.couponCode.toLowerCase().trim();
    if (code === 'save10') {
      this.subtotal *= 0.9;
      alert('10% Discount Applied!');
      return;
    }
    // Pizza/Burger Logic
    let applied = false;
    this.cartItems.forEach(item => {
      const name = item.name.toLowerCase();
      if ((name.includes('pizza') || name.includes('burger') || name.includes('shawarma')) && item.qty >= 7) {
        if (!item.isFreeItemAdded) {
          item.qty += 1;
          item.isFreeItemAdded = true;
          applied = true;
        }
      }
    });
    if (applied) { this.calculateTotal(); alert('Free Item Added!'); }
  }

  goBack() { window.history.back(); }
  goToPage(path: string) { this.router.navigate([path]); }

  async clearCart() {
    this.cartItems = [];
    this.calculateTotal();
  }

  async proceedToCheckout() {
    if (!this.isLoggedIn) {
      this.router.navigate(['/sign-in']);
      return;
    }
    this.router.navigate(['/checkout'], {
      state: { items: this.cartItems, totalAmount: this.subtotal + this.deliveryFee }
    });
  }
}