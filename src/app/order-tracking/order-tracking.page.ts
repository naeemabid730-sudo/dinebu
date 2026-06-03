import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, ToastController } from '@ionic/angular';

// OpenLayers Imports
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Icon } from 'ol/style';

import { addIcons } from 'ionicons';
import { arrowBackOutline, callOutline, chatbubbleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.page.html',
  styleUrls: ['./order-tracking.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class OrderTrackingPage implements OnDestroy {
  map!: Map;
  riderFeature!: Feature;
  vectorSource!: VectorSource;
  simulationInterval: any;

  // DineBux Location Coords [Longitude, Latitude]
  customerCoords = [73.3871, 30.3451];
  riderCoords = [73.3900, 30.3480];

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private cdr: ChangeDetectorRef // Angular detection fix
  ) {
    addIcons({ arrowBackOutline, callOutline, chatbubbleOutline });
  }

  // Mobile/Capacitor ke liye ionViewDidEnter behtareen hai
  ionViewDidEnter() {
    this.initMap();
  }

  initMap() {
    // Purana instance clear karein agar exist karta ho
    if (this.map) {
      this.map.setTarget(undefined);
    }

    // Styles setup
    const riderStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'https://cdn-icons-png.flaticon.com/64/2972/2972185.png',
        scale: 0.7
      })
    });

    const customerStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'https://cdn-icons-png.flaticon.com/64/1673/1673188.png',
        scale: 0.6
      })
    });

    // Features creation
    this.riderFeature = new Feature({
      geometry: new Point(fromLonLat(this.riderCoords))
    });
    this.riderFeature.setStyle(riderStyle);

    const customerFeature = new Feature({
      geometry: new Point(fromLonLat(this.customerCoords))
    });
    customerFeature.setStyle(customerStyle);

    this.vectorSource = new VectorSource({
      features: [customerFeature, this.riderFeature]
    });

    // Map Initialization
    this.map = new Map({
      target: 'mapId',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        new VectorLayer({
          source: this.vectorSource
        })
      ],
      view: new View({
        center: fromLonLat(this.customerCoords),
        zoom: 15
      }),
      controls: [] 
    });

    // CRITICAL ANDROID FIX: Map size update and detection
    setTimeout(() => {
      if (this.map) {
        this.map.updateSize();
        this.cdr.detectChanges(); 
        console.log("Map initialized and sized for mobile");
      }
    }, 500);

    this.startSimulation();
  }

  startSimulation() {
    if (this.simulationInterval) clearInterval(this.simulationInterval);

    this.simulationInterval = setInterval(() => {
      if (this.riderFeature) {
        const geometry = this.riderFeature.getGeometry() as Point;
        const coords = geometry.getCoordinates();
        // Simulation movement
        const newCoords = [coords[0] - 15, coords[1] - 15]; 
        geometry.setCoordinates(newCoords);
        this.cdr.detectChanges(); // UI update for smooth movement
      }
    }, 3000);
  }

  goBack() { this.navCtrl.back(); }

  makeCall(num: string) { window.open(`tel:${num}`, '_system'); }

  async openChat() {
    const toast = await this.toastCtrl.create({
      message: 'Opening Chat...',
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }

  async showStatusDetail() {
    const toast = await this.toastCtrl.create({
      message: 'Rider is on the way!',
      duration: 2000,
      position: 'top',
      color: 'dark'
    });
    toast.present();
  }

  ngOnDestroy() {
    if (this.simulationInterval) clearInterval(this.simulationInterval);
    if (this.map) {
      this.map.setTarget(undefined);
    }
  }
}