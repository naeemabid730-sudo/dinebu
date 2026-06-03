import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonButton, 
  IonIcon, 
  IonFab, 
  IonFabButton, 
  IonModal, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonRow, 
  IonCol, 
  IonToggle,
  ToastController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBack, 
  searchOutline, 
  locationOutline, 
  locate, 
  homeOutline, 
  briefcaseOutline, 
  businessOutline, 
  pinOutline, 
  pin,
  checkmarkCircleOutline 
} from 'ionicons/icons';

declare var L: any;

@Component({
  selector: 'app-pick-map',
  templateUrl: './pick-map.page.html',
  styleUrls: ['./pick-map.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonContent, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonButtons, 
    IonButton, 
    IonIcon, 
    IonFab, 
    IonFabButton, 
    IonModal, 
    IonItem, 
    IonLabel, 
    IonInput, 
    IonRow, 
    IonCol, 
    IonToggle
  ]
})
export class PickMapPage implements OnInit, AfterViewInit {
  // Map properties
  map: any;
  userMarker: any;
  isModalOpen: boolean = false;
  currentLocationName: string = 'Pakpattan Sharif'; 
  
  // Form Fields - Initialized empty for validation
  tempTitle: string = 'Home';
  tempDetail: string = ''; // Address from map
  apartment: string = '';
  city: string = 'Pakpattan';
  state: string = 'Punjab';
  zipCode: string = '';
  country: string = 'Pakistan';
  isDefault: boolean = false;

  // Edit Mode properties
  isEditMode: boolean = false;
  editIndex: number | null = null;

  // Default Pakpattan Coordinates
  pakLat: number = 30.3405;
  pakLng: number = 73.3853;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastCtrl: ToastController
  ) {
    addIcons({ 
      arrowBack, searchOutline, locationOutline, locate, 
      homeOutline, briefcaseOutline, businessOutline, pinOutline, pin,
      'checkmark-circle-outline': checkmarkCircleOutline 
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['mode'] === 'edit') {
        this.isEditMode = true;
        this.editIndex = +params['editIndex'];
        this.tempTitle = params['title'];
        this.tempDetail = params['detail'];
        // Optional: edit mode mein baki fields bhi load kar sakte hain agar saved hain
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadMap();
    }, 500);
  }

  loadMap() {
    // If map already initialized, don't do it again
    if (this.map) return;

    this.map = L.map('map', {
      center: [this.pakLat, this.pakLng],
      zoom: 15,
      zoomControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    const redIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      iconSize: [35, 35],
      iconAnchor: [17, 35]
    });

    this.userMarker = L.marker([this.pakLat, this.pakLng], { icon: redIcon }).addTo(this.map);

    this.map.on('move', () => {
      this.userMarker.setLatLng(this.map.getCenter());
    });

    this.map.on('moveend', () => {
      const center = this.map.getCenter();
      this.fetchAddress(center.lat, center.lng);
    });

    this.getCurrentLocation();
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        this.map.setView([lat, lng], 17);
        this.userMarker.setLatLng([lat, lng]);
        this.fetchAddress(lat, lng);
      }, (err) => {
        console.warn("Location permission denied.");
        this.fetchAddress(this.pakLat, this.pakLng);
      });
    }
  }

  async fetchAddress(lat: number, lng: number) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      
      // Update header area name
      this.currentLocationName = data.address.suburb || 
                                 data.address.neighbourhood || 
                                 data.address.city_district || 
                                 data.address.town || 
                                 'Pakpattan Area';
      
      // Update full detail for input field
      this.tempDetail = data.display_name;
      
      if (data.address.city || data.address.town) {
        this.city = data.address.city || data.address.town;
      }
      if (data.address.postcode) {
        this.zipCode = data.address.postcode;
      }
    } catch (e) {
      console.error("Geocoding error", e);
    }
  }

  openAddressModal() {
    this.isModalOpen = true;
  }

  async saveFinalAddress() {
    // Basic validation
    if (!this.tempDetail || this.tempDetail.trim() === '') return;

    const addressObj = {
      title: this.tempTitle,
      detail: this.tempDetail,
      apartment: this.apartment,
      city: this.city,
      state: this.state,
      zip: this.zipCode,
      country: this.country,
      isDefault: this.isDefault
    };

    const savedData = localStorage.getItem('addresses');
    let list = savedData ? JSON.parse(savedData) : [];

    if (this.isEditMode && this.editIndex !== null) {
      list[this.editIndex] = addressObj;
    } else {
      list.push(addressObj);
    }

    localStorage.setItem('addresses', JSON.stringify(list));
    this.isModalOpen = false;

    const toast = await this.toastCtrl.create({
      message: 'Address Saved Successfully!',
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    toast.present();

    this.router.navigate(['/my-addrass']);
  }

  goBack() {
    this.router.navigate(['/my-addrass']);
  }
}