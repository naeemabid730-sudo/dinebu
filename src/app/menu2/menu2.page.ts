import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 

import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonIcon, 
  IonFooter 
} from '@ionic/angular/standalone';

import { register } from 'swiper/element/bundle';
import { addIcons } from 'ionicons';

// ✅ Saare zaroori icons yahan import hain
import { 
  searchOutline, 
  homeOutline, 
  restaurant, 
  restaurantOutline, 
  bagOutline, 
  bagHandleOutline, 
  receiptOutline, 
  personOutline, 
  addOutline, 
  chevronForwardOutline,
  heartOutline,
  optionsOutline,
  cartOutline
} from 'ionicons/icons';

register();

@Component({
  selector: 'app-menu2',
  templateUrl: './menu2.page.html',
  styleUrls: ['./menu2.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonIcon, 
    IonFooter, 
    CommonModule, 
    FormsModule
  ]
})
export class Menu2Page implements OnInit {

  selectedCategory: string = 'Burgers';
  cartCount: number = 0;
  cartItems: any[] = [];

  categories = [
    { name: 'Burgers', img: 'assets/g (7).png' },
    { name: 'Pizza', img: 'assets/g (3).png' },
    { name: 'Wraps', img: 'assets/g (1).png' },
    { name: 'Desserts', img: 'assets/g (5).png' },
    { name: 'Pasta', img: 'assets/g (4).png' },
    { name: 'Beverages', img: 'assets/g (8).png' },
  ];

  foods = [
    // --- BURGERS ---
    { id: 1, name: 'Chicken Burger', cat: 'Burgers', desc: 'Golden crispy chicken patty served with creamy mayonnaise, fresh lettuce, and toasted sesame buns.', price: 240, img: 'assets/n (4).png', hasSize: false },
    { id: 2, name: 'Cheese Burger', cat: 'Burgers', desc: 'Classic juicy beef patty topped with a melting cheddar slice, tangy pickles, and our signature burger sauce.', price: 340, img: 'assets/n (5).png', hasSize: false },
    { id: 3, name: 'Zinger Deluxe', cat: 'Burgers', desc: 'Spicy hand-breaded zinger fillet with crunchy lettuce, premium mayo, and a hint of black pepper in soft buns.', price: 450, img: 'assets/a (1).png', hasSize: false },
    { id: 4, name: 'Tower Burger', cat: 'Burgers', desc: 'A monster double-patty burger layered with hash browns, extra cheese, and fresh veggies for the ultimate hunger.', price: 650, img: 'assets/a (2).png', hasSize: true },

    // --- PIZZA ---
    { id: 5, name: 'Fajita Pizza', cat: 'Pizza', desc: 'Marinated spicy chicken fajita chunks, onions, and bell peppers topped with a thick layer of mozzarella cheese.', price: 850, img: 'assets/g (3).png', hasSize: true },
    { id: 6, name: 'Tikka Pizza', cat: 'Pizza', desc: 'Authentic desi-style smoky chicken tikka chunks with onions and a special blend of traditional spices.', price: 800, img: 'assets/n (7).png', hasSize: true },
    { id: 7, name: 'Margherita', cat: 'Pizza', desc: 'Simple yet elegant: Loaded with premium mozzarella cheese, fresh basil leaves, and our secret Italian tomato sauce.', price: 700, img: 'assets/a (7).png', hasSize: true },
    { id: 8, name: 'Veggie Delight', cat: 'Pizza', desc: 'A colorful garden pizza with olives, mushrooms, sweet corn, bell peppers, and onions on a crispy thin crust.', price: 750, img: 'assets/a (8).png', hasSize: true },

    // --- WRAPS ---
    { id: 9, name: 'BBQ Shawarma Wrap', cat: 'Wraps', desc: 'Slow-grilled chicken shawarma tossed in smoky BBQ sauce, wrapped in soft pita with garlic mayo and pickles.', price: 350, img: 'assets/g (1).png', hasSize: false },
    { id: 10, name: 'Zinger Wrap', cat: 'Wraps', desc: 'Crispy chicken zinger strips, shredded lettuce, and spicy jalapeños wrapped in a toasted flour tortilla.', price: 400, img: 'assets/a (5).png', hasSize: false },
    { id: 11, name: 'Mexican Tortilla', cat: 'Wraps', desc: 'A fiery mix of grilled chicken, spicy beans, corn, and salsa wrapped tightly in a soft Mexican-style tortilla.', price: 450, img: 'assets/a (6).png', hasSize: false },
    { id: 12, name: 'Grilled Seekh Wrap', cat: 'Wraps', desc: 'Charcoal-grilled beef seekh kebabs paired with fresh onions and mint chutney, rolled in a traditional paratha.', price: 500, img: 'assets/a (9).png', hasSize: false },

    // --- DESSERTS ---
    { id: 13, name: 'Khoya Kheer', cat: 'Desserts', desc: 'Rich and creamy traditional rice pudding slow-cooked with pure khoya, saffron, and garnished with crushed almonds.', price: 150, img: 'assets/g (5).png', hasSize: false },
    { id: 14, name: 'Chocolate Brownie', cat: 'Desserts', desc: 'Decadent warm chocolate fudge brownie with a gooey center, loaded with walnuts and served with love.', price: 250, img: 'assets/n (2).png', hasSize: false },
    { id: 15, name: 'Gulab Jamun', cat: 'Desserts', desc: 'Two pieces of soft, melt-in-your-mouth milk solids dumplings soaked in a warm cardamom-infused sugar syrup.', price: 120, img: 'assets/n (1).png', hasSize: false },
    { id: 16, name: 'Ice Cream Scoop', cat: 'Desserts', desc: 'Premium chilled scoop of your favorite flavor (Vanilla, Chocolate, or Strawberry) with a drizzle of chocolate syrup.', price: 180, img: 'assets/n (3).png', hasSize: false },

    // --- PASTA ---
    { id: 17, name: 'White Sauce Pasta', cat: 'Pasta', desc: 'Al dente pasta tossed in a rich, velvety parmesan cream sauce with grilled chicken, mushrooms, and Italian herbs.', price: 550, img: 'assets/g (4).png', hasSize: false },
    { id: 18, name: 'Red Sauce Pasta', cat: 'Pasta', desc: 'Spicy and tangy penne pasta cooked in a slow-simmered tomato and basil sauce with a sprinkle of chili flakes.', price: 500, img: 'assets/a (4).png', hasSize: false },
    { id: 19, name: 'Spaghetti Bolognese', cat: 'Pasta', desc: 'Long spaghetti strands topped with a hearty, slow-cooked beef mince ragu and finished with freshly grated cheese.', price: 650, img: 'assets/a (3).png', hasSize: false },
    { id: 20, name: 'Spicy Penne', cat: 'Pasta', desc: 'Zesty penne pasta infused with a hot garlic and chili oil sauce, tossed with bell peppers and roasted chicken.', price: 480, img: 'assets/ji (7).jpeg', hasSize: false },

    // --- BEVERAGES ---
    { id: 21, name: 'Mint Margarita', cat: 'Beverages', desc: 'The ultimate thirst quencher: A blended mix of fresh mint leaves, lime juice, ice, and fizzy soda.', price: 250, img: 'assets/g (8).png', hasSize: false },
    { id: 22, name: 'Pina Colada', cat: 'Beverages', desc: 'A tropical delight made with creamy coconut milk, sweet pineapple juice, and blended to a smooth perfection.', price: 350, img: 'assets/n (8).png', hasSize: false },
    { id: 23, name: 'Cold Coffee', cat: 'Beverages', desc: 'Smooth blended coffee with chilled milk, vanilla ice cream, and topped with chocolate powder and a wafer stick.', price: 400, img: 'assets/a (11).png', hasSize: false },
    { id: 24, name: 'Fresh Orange Juice', cat: 'Beverages', desc: 'Pure 100% seasonal oranges squeezed fresh to order. No added sugar, just natural Vitamin C goodness.', price: 300, img: 'assets/a (10).png', hasSize: false },
  ];

  constructor(private router: Router) { 
    // Icons register karein
    addIcons({
      searchOutline, homeOutline, restaurant, restaurantOutline,
      bagOutline, bagHandleOutline, receiptOutline, personOutline, 
      addOutline, chevronForwardOutline, heartOutline, optionsOutline, cartOutline
    });

    // Details page se wapas aane wala data handle karein
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const addedItem = navigation.extras.state['addedItem'];
      const addedQty = navigation.extras.state['addedQty'];

      if (addedItem && addedQty) {
        for(let i = 0; i < addedQty; i++) {
          this.cartItems.push(addedItem);
        }
        this.cartCount = this.cartItems.length;
      }
    }
  }

  ngOnInit() {}

  selectCategory(cat: string) {
    this.selectedCategory = cat;
  }

  getFilteredFoods() {
    return this.foods.filter(f => f.cat === this.selectedCategory);
  }

  addToCart(item: any, event: Event) {
    event.stopPropagation(); // Card click (details) ko rokne ke liye
    this.cartItems.push(item);
    this.cartCount = this.cartItems.length;
    console.log('Added to cart:', item.name);
  }

  // ✅ Yeh function ab poora data Details page par bheje ga
  openDetails(item: any) {
    this.router.navigate(['/details'], {
      state: { product: item }
    });
  }

  goToPage(path: string) {
    if (path === '/my-cart') {
      this.router.navigate([path], {
        state: { products: this.cartItems }
      });
    } else {
      this.router.navigate([path]);
    }
  }

  goToSearch() {
    this.router.navigate(['/search']);
  }
}