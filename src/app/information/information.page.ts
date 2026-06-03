import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonButton, IonHeader, IonToolbar, IonButtons, IonTitle } from '@ionic/angular/standalone';
import { App } from '@capacitor/app';
import { Device } from '@capacitor/device';
import { Network, ConnectionStatus } from '@capacitor/network';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, 
  wifiOutline, 
  hardwareChipOutline, 
  informationCircleOutline, 
  cameraOutline,
  globeOutline,
  appsOutline
} from 'ionicons/icons';

// WifiWizard2 declaration for global access
declare var WifiWizard2: any;

@Component({
  selector: 'app-information',
  standalone: true,
  templateUrl: './information.page.html',
  styleUrls: ['./information.page.scss'],
  imports: [
    CommonModule, 
    IonContent, 
    IonIcon, 
    IonButton, 
    IonHeader, 
    IonToolbar, 
    IonButtons, 
    IonTitle
  ]
})
export class InformationPage implements OnInit, OnDestroy {

  // App Info
  appName: string = 'DineBux';
  appSize: string = '24.5 MB'; // Static value added to fix TS2339 error
  version: string = '1.0.0';
  build: string = '1';

  // Device Info
  model: string = 'Loading...';
  platform: string = 'Loading...';
  osVersion: string = 'Loading...';
  manufacturer: string = 'Loading...';

  // Network Info
  networkStatus: string = 'Checking...';
  networkName: string = 'Unknown';

  capturedImage: string = '';
  private networkListener: any;

  constructor(private router: Router) {
    addIcons({ 
      arrowBackOutline, 
      wifiOutline, 
      hardwareChipOutline, 
      informationCircleOutline,
      cameraOutline,
      globeOutline,
      appsOutline
    });
  }

  async ngOnInit() {
    await this.loadAppInfo();
    await this.loadDeviceInfo();
    await this.loadNetworkInfo();
    this.listenNetworkChange();
  }

  ngOnDestroy() {
    // Listener remove karna zaroori hai memory leaks se bachne ke liye
    if (this.networkListener) {
      this.networkListener.remove();
    }
  }

  async loadAppInfo() {
    try {
      const app = await App.getInfo();
      this.appName = app.name || 'DineBux';
      this.version = app.version;
      this.build = app.build;
    } catch (e) {
      console.warn("App info not available in browser", e);
    }
  }

  async loadDeviceInfo() {
    try {
      const device = await Device.getInfo();
      this.model = device.model;
      this.platform = device.platform;
      this.osVersion = device.osVersion;
      this.manufacturer = device.manufacturer || 'Unknown';
    } catch (e) {
      console.warn("Device info not available in browser", e);
    }
  }

  async loadNetworkInfo() {
    try {
      const status = await Network.getStatus();
      await this.updateNetwork(status);
    } catch (e) {
      this.networkStatus = 'Error';
    }
  }

  listenNetworkChange() {
    this.networkListener = Network.addListener(
      'networkStatusChange',
      async (status: ConnectionStatus) => {
        await this.updateNetwork(status);
      }
    );
  }

  async updateNetwork(status: ConnectionStatus) {
    if (!status.connected) {
      this.networkStatus = 'OFFLINE';
      this.networkName = 'No Internet';
      return;
    }

    this.networkStatus = status.connectionType.toUpperCase();

    if (status.connectionType === 'wifi') {
      if (typeof WifiWizard2 !== 'undefined') {
        try {
          WifiWizard2.getConnectedSSID((ssid: string) => {
            this.networkName = ssid || 'Connected to WiFi';
          }, () => {
            this.networkName = 'WiFi Connected';
          });
        } catch {
          this.networkName = 'WiFi Connected';
        }
      } else {
        this.networkName = 'WiFi Connected';
      }
    } else if (status.connectionType === 'cellular') {
      this.networkName = 'Mobile Data';
    } else {
      this.networkName = status.connectionType;
    }
  }

  async openCamera() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt // User gallery ya camera dono use kar sakta hai
      });
      this.capturedImage = image.dataUrl || '';
    } catch (e) {
      console.log("User cancelled camera or error occurred");
    }
  }

  back() {
    this.router.navigate(['/profile']);
  }
}