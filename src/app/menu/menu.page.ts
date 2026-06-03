import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonIcon,
  IonGrid, IonRow, IonCol, IonFooter, IonModal, IonButtons, IonButton 
} from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';
import { addIcons } from 'ionicons';
import { 
  notificationsOutline, locationOutline, location, chevronDownOutline,
  searchOutline, homeOutline, restaurantOutline, bagOutline,
  receiptOutline, personOutline, addOutline, caretDownOutline,
  navigateCircle, navigateOutline, mapOutline, flameOutline,
  informationCircleOutline, personCircleOutline, callOutline, 
  timeOutline, restaurant
} from 'ionicons/icons';

// Leaflet map declaration
declare var L: any;

// Swiper register
register();

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonIcon,
    IonGrid, IonRow, IonCol, IonFooter, IonModal, IonButtons, IonButton,
    CommonModule, FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MenuPage implements OnInit {
  // --- State Variables ---
  currentBranch: number = 1;
  isBranchModalOpen: boolean = false;
  isInfoModalOpen: boolean = false; // ✅ Error Solve: Variable defined
  cartItems: any[] = []; 
  items: any[] = [];

  // --- Location Variables ---
  selectedLocation: string = 'Pakpattan Sharif';
  tempAddress: string = 'Loading Pakpattan Map...';
  isLocationModalOpen: boolean = false;
  isMapModalOpen: boolean = false;
  map: any;

  // Map Coordinates
  pakpattanLat: number = 30.3405;
  pakpattanLng: number = 73.3855;

  // Branch Data
  branch1Items = [
    { id: 1, name: 'BBQ Shawarma Roll', price: 550, img: 'assets/g (1).png', desc: 'Spicy BBQ chicken with garlic sauce', weight: '250g' },
    { id: 2, name: 'Mint Margarita', price: 350, img: 'assets/g (6).png', desc: 'Chilled refreshing mint & lime soda', weight: '300ml' },
    { id: 3, name: 'Khoya Kheer', price: 120, img: 'assets/g (5).png', desc: 'Traditional dessert with pure khoya', weight: '150g' },
    { id: 4, name: 'Fajita Pizza', price: 750, img: 'assets/g (3).png', desc: 'Cheesy crust with bell peppers', weight: 'Small' },
    { id: 5, name: 'Fries', price: 350, img: 'assets/g (2).png', desc: 'Crispy golden salted potato fries', weight: 'Large' },
    { id: 6, name: 'Pasta', price: 450, img: 'assets/g (4).png', desc: 'Creamy white sauce with herbs', weight: '350g' }
  ];

  branch2Items = [
    { id: 101, name: 'Family Deal', price: 850, img: 'assets/sp (1).png' },
    { id: 102, name: 'Special Pizza', price: 1500, img: 'assets/sp (3).png' },
    { id: 103, name: 'Deal Fries', price: 1200, img: 'assets/sp (2).png' }
  ];

  constructor(private router: Router) {
    // Registered icons used in your HTML
    addIcons({
      notificationsOutline, locationOutline, location, chevronDownOutline,
      searchOutline, homeOutline, restaurantOutline, bagOutline,
      receiptOutline, personOutline, addOutline, caretDownOutline,
      navigateCircle, navigateOutline, mapOutline, flameOutline,
      informationCircleOutline, personCircleOutline, callOutline, 
      timeOutline, restaurant
    });
  }

  ngOnInit() {
    this.items = this.shuffleArray([...this.branch1Items]);
  }

  // ✅ Error Solve: handleInfoClick method added
  handleInfoClick() {
    this.isInfoModalOpen = true;
  }

  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // --- BRANCH FUNCTIONS ---
  openBranchModal() {
    this.isBranchModalOpen = true;
  }

  selectBranch(branchNum: number) {
    this.currentBranch = branchNum;
    this.isBranchModalOpen = false;
  }

  // --- LOCATION & MAP FUNCTIONS ---
  openLocationModal() { 
    this.isLocationModalOpen = true; 
  }

  useCurrentLocation() {
    this.selectedLocation = 'Detected: Pakpattan City';
    this.isLocationModalOpen = false;
  }

  openMap() {
    this.isLocationModalOpen = false;
    setTimeout(() => {
      this.isMapModalOpen = true;
      setTimeout(() => { this.initLiveMap(); }, 500);
    }, 300);
  }

  initLiveMap() {
    try {
      if (this.map) { this.map.remove(); }
      this.map = L.map('mapId', {
        center: [this.pakpattanLat, this.pakpattanLng],
        zoom: 15,
        zoomControl: false
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
      setTimeout(() => { this.map.invalidateSize(); }, 200);
      
      this.map.on('moveend', () => {
        const center = this.map.getCenter();
        this.updateAreaName(center.lat, center.lng);
      });
    } catch (err) {
      console.error("Map Error: ", err);
    }
  }

  updateAreaName(lat: number, lng: number) {
    if (lat > 30.342) this.tempAddress = "Near Green Town, Pakpattan";
    else if (lng > 73.387) this.tempAddress = "Learn2Earn (Painwali), Pakpattan";
    else this.tempAddress = "Ghalla Mandi / City Area, Pakpattan";
  }

  confirmLocation() {
    this.selectedLocation = this.tempAddress;
    this.isMapModalOpen = false;
  }

  // --- NAVIGATION & CART ---
  addToCart(product: any) { 
    this.cartItems.push({ ...product, qty: 1 }); 
  }

  goToPage(path: string) { 
    this.router.navigate([path]); 
  }

  goToCart() { 
    this.router.navigate(['/my-cart'], { state: { products: this.cartItems } }); 
  } 

  openDetails(item: any) { 
    const navigationExtras: NavigationExtras = {
      state: { product: item }
    };
    this.router.navigate(['/details'], navigationExtras); 
  }

  goToSearch() {
    this.router.navigate(['/search']);
  }
}