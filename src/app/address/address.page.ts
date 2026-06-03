import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline, location, locateOutline, businessOutline } from 'ionicons/icons';

declare var L: any;

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddressPage implements AfterViewInit {
  map: any;
  addressDetails = { address: '', flatNo: '', label: 'home' };
  cityLabel: string = '';

  constructor(private router: Router) {
    addIcons({ arrowBackOutline, location, locateOutline, businessOutline });
  }

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    this.map = L.map('mapId', { zoomControl: false }).setView([30.3753, 69.3451], 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO'
    }).addTo(this.map);

    this.map.on('moveend', () => {
      const center = this.map.getCenter();
      this.fetchAddress(center.lat, center.lng);
    });

    this.getCurrentLocation();
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        this.map.setView([pos.coords.latitude, pos.coords.longitude], 16);
        this.fetchAddress(pos.coords.latitude, pos.coords.longitude);
      });
    }
  }

  async fetchAddress(lat: number, lng: number) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      this.addressDetails.address = data.display_name;
      this.cityLabel = data.address.city || data.address.town || data.address.village || 'Location';
    } catch (error) {
      this.addressDetails.address = "Address not found";
    }
  }

  isFormValid() { 
    return this.addressDetails.address !== '' && this.addressDetails.flatNo !== ''; 
  }

  goBack() { 
    window.history.back(); 
  }

  goToPayment() {
    if (this.isFormValid()) {
      const userAddress = {
        fullAddress: this.addressDetails.address,
        flatNo: this.addressDetails.flatNo,
        label: this.addressDetails.label,
        city: this.cityLabel
      };
      // LocalStorage mein save karein
      localStorage.setItem('selectedAddress', JSON.stringify(userAddress));
      this.router.navigate(['/payment']);
    } else {
      alert("Please fill in all address details");
    }
  }
}