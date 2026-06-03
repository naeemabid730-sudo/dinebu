import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router'; // ✅ NavigationExtras add kiya
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, 
  searchOutline, 
  closeOutline, 
  star, 
  timeOutline, 
  addOutline,
  closeCircle
} from 'ionicons/icons';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SearchPage implements OnInit {
  searchQuery: string = '';
  filteredItems: any[] = [];

  allItems = [
    // --- BURGERS ---
    {
      name: 'Chicken Burger',
      price: 240,
      desc: 'A savory sandwich featuring a seasoned chicken patty.',
      image: '../../assets/a (1).png',
      category: 'Burgers',
      rating: 4.5,
      time: '15-20 min',
      isBestSeller: true
    },
    {
      name: 'Cheese Burger',
      price: 340,
      desc: 'A juicy 100% beef patty seasoned with a pinch of salt.',
      image: '../../assets/a (2).png',
      category: 'Burgers',
      rating: 4.8,
      time: '20-25 min',
      isBestSeller: true
    },
    {
      name: 'Zinger Burger',
      price: 350,
      desc: 'Crunchy fried chicken thigh topped with lettuce and mayo.',
      image: '../../assets/z1 (8).jpeg',
      category: 'Burgers',
      rating: 4.7,
      time: '15 min',
      isBestSeller: false
    },
    {
      name: 'Beef Burger',
      price: 500,
      desc: 'Premium double beef patty with melted cheddar.',
      image: '../../assets/ji (4).jpeg',
      category: 'Burgers',
      rating: 4.2,
      time: '25 min',
      isBestSeller: false
    },

    // --- PIZZAS ---
    {
      name: 'Chipotle Pizza',
      price: 400,
      desc: 'A high-quality, smoky, and spicy chipotle base.',
      image: '../../assets/g (3).png',
      category: 'Pizza',
      rating: 4.6,
      time: '30-35 min',
      isBestSeller: true
    },
    {
      name: 'Chicken BBQ Pizza',
      price: 1050,
      desc: 'Roasted chicken, red onions, and smoky BBQ sauce.',
      image: '../../assets/ji.jpeg',
      category: 'Pizza',
      rating: 4.4,
      time: '30 min',
      isBestSeller: false
    },
    {
      name: 'Extreme Pizza',
      price: 1150,
      desc: 'Loaded with pepperoni, olives, peppers and extra cheese.',
      image: '../../assets/a (7).png',
      category: 'Pizza',
      rating: 4.9,
      time: '40 min',
      isBestSeller: true
    },
    {
      name: 'Fajita Pizza',
      price: 950,
      desc: 'Marinated chicken fajita chunks with bell peppers.',
      image: '../../assets/a (8).png',
      category: 'Pizza',
      rating: 4.3,
      time: '30 min',
      isBestSeller: false
    },

    // --- WRAPS ---
    {
      name: 'Chicken Wrap',
      price: 350,
      desc: 'Grilled chicken wrapped in soft tortilla with garlic sauce.',
      image: '../../assets/g (1).png',
      category: 'Wraps',
      rating: 4.1,
      time: '10-15 min',
      isBestSeller: false
    },
    {
      name: 'BBQ Shawarma Wrap',
      price: 950,
      desc: 'Spiced shawarma meat with BBQ drizzle.',
      image: '../../assets/a (5).png',
      category: 'Wraps',
      rating: 4.5,
      time: '12 min',
      isBestSeller: true
    },

    // --- DESSERTS ---
    {
      name: 'Khoya Kheer',
      price: 350,
      desc: 'Traditional sweet rice pudding with rich khoya.',
      image: '../../assets/g (5).png',
      category: 'Desserts',
      rating: 4.8,
      time: '5 min',
      isBestSeller: true
    },
    {
      name: 'Chocolate Brownie',
      price: 950,
      desc: 'Warm chocolate brownie with walnuts.',
      image: '../../assets/z1 (11).jpeg',
      category: 'Desserts',
      rating: 4.7,
      time: '10 min',
      isBestSeller: false
    },

    // --- DRINKS ---
    {
      name: 'Mint Margarita',
      price: 350,
      desc: 'Refreshing blend of fresh mint, lime, and soda.',
      image: '../../assets/a (10).png',
      category: 'Drinks',
      rating: 4.9,
      time: '5 min',
      isBestSeller: true
    },
    {
      name: 'Coke Cold Drink',
      price: 150,
      desc: 'Chilled 500ml Coca Cola bottle.',
      image: '../../assets/a (11).png',
      category: 'Drinks',
      rating: 4.5,
      time: '2 min',
      isBestSeller: false
    }
  ];

  // ✅ Router ko yahan inject kiya constructor mein
  constructor(private router: Router) { 
    addIcons({
      arrowBackOutline,
      searchOutline,
      closeOutline,
      star,
      timeOutline,
      addOutline,
      closeCircle
    });
  }

  ngOnInit() {
    this.filteredItems = [...this.allItems];
  }

  onSearchChange(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery = query;
    
    if (query === '') {
      this.filteredItems = [...this.allItems];
    } else {
      this.filteredItems = this.allItems.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.desc && item.desc.toLowerCase().includes(query))
      );
    }
  }

  goBack() {
    window.history.back();
  }

  clearSearch() {
    this.searchQuery = '';
    this.filteredItems = [...this.allItems];
  }

  // search.page.ts mein
goToDetails(item: any) {
  const navigationExtras: NavigationExtras = {
    state: {
      product: item // Yahan item.image bhej raha hai
    }
  };
  this.router.navigate(['/details'], navigationExtras);
}
}