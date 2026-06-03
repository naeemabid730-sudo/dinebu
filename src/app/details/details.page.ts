import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; 
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonIcon, 
  IonFooter, 
  IonButtons, 
  IonBackButton,
  IonSpinner,
  IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, bagOutline, addOutline, removeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonIcon, 
    IonFooter, 
    IonButtons, 
    IonBackButton, 
    IonSpinner,
    IonButton,
    CommonModule, 
    FormsModule
  ]
})
export class DetailsPage implements OnInit {

  product: any;
  source: string = ''; 
  quantity: number = 1;
  cartCount: number = 0;

  constructor(private route: ActivatedRoute, private router: Router) {
    // Icons registration
    addIcons({ arrowBackOutline, bagOutline, addOutline, removeOutline });

    // ✅ State se product aur source receive karna (Cleaned)
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.product = navigation.extras.state['product'];
      this.source = navigation.extras.state['source'] || ''; 
      console.log('Product received:', this.product, 'from source:', this.source);
    }
  }

  ngOnInit() {
    // Agar page refresh ho jaye aur product data gum ho jaye toh wapis bhej dega
    if (!this.product) {
      this.router.navigate(['/menu']); // Ya jo bhi aapka default page hai
    }
  }

  // Quantity control
  increase() {
    this.quantity++;
  }

  decrease() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // ✅ Dynamic Back Logic
  goBack() {
    if (this.source === 'menu') {
      this.router.navigate(['/menu']);
    } else if (this.source === 'menu2') {
      this.router.navigate(['/menu2']);
    } else if (this.source === 'search') {
      this.router.navigate(['/search']);
    } else {
      window.history.back();
    }
  }

  goToCart() {
    this.router.navigate(['/my-cart']);
  }

  /**
   * ✅ Add to Cart
   * Product data ko cart page par bhej raha hai
   */
  addToCart() {
    if (this.product) {
      // Yahan hum state mein pura product aur uski quantity bhej rahe hain
      const cartData = { 
        ...this.product, 
        qty: this.quantity,
        totalPrice: this.product.price * this.quantity 
      };
      
      console.log('Sending to cart:', cartData);
      
      this.router.navigate(['/my-cart'], {
        state: { product: cartData }
      });
    }
  } 
}