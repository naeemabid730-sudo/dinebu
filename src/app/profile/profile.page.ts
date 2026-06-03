import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonFooter, IonButton, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon, IonFooter, IonButton]
})
export class ProfilePage implements OnInit {

  name: string = ''; 
  email: string = '';
  phone: string = '';
  address: string = 'Add your address';
  userPhoto: string | null = null; 

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {
    // Sabhi icons ko ek saath add kar diya hai taake list lambi na dikhe
    addIcons({ ...allIcons });
  }

  ionViewWillEnter() {
    this.loadUserData();
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const isCreated = localStorage.getItem('isAccountCreated');
    
    // Security Check: Agar user logged in nahi hai, toh use 'account' par bhej dein
    if (isCreated !== 'true') {
      this.router.navigate(['/account'], { replaceUrl: true });
      return;
    }

    // Data Load
    this.name = localStorage.getItem('userName') || '';
    this.email = localStorage.getItem('userEmail') || '';
    this.phone = localStorage.getItem('userPhone') || '';
    this.userPhoto = localStorage.getItem('userPhoto');

    const savedAddress = localStorage.getItem('addresses');
    if (savedAddress) {
      try {
        const addrList = JSON.parse(savedAddress);
        if (addrList.length > 0) {
          this.address = addrList[addrList.length - 1].title; 
        }
      } catch (e) {
        console.error("Address parsing error", e);
      }
    }
  }

  async openNativeAppInfo() {
    try {
      await NativeSettings.open({
        optionAndroid: AndroidSettings.ApplicationDetails, 
        optionIOS: IOSSettings.App 
      });
    } catch (error) {
      console.error("Error opening App Info", error);
    }
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Sign Out',
      message: 'Kya aap logout karna chahte hain?',
      buttons: [
        { text: 'Nahi', role: 'cancel' },
        {
          text: 'Logout',
          handler: () => {
            localStorage.clear();
            this.router.navigate(['/account'], { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteAccount() {
    const alert = await this.alertController.create({
      header: 'Delete Account',
      message: 'Aapka account hamesha ke liye delete ho jayega.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          handler: () => {
            localStorage.clear();
            this.router.navigate(['/account'], { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
  }

  goToPage(path: string) {
    this.router.navigate([path]);
  }

  openLink(type: string) {
    const url = type === 'privacy' ? 'https://dinebux.com/privacy-policy' : 'https://dinebux.com/terms-and-conditions';
    window.open(url, '_blank');
  }
}