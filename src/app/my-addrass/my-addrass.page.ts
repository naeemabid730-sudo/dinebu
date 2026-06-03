import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationExtras } from '@angular/router';
import { IonContent, IonIcon, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBack, location, addCircleOutline, mapOutline, 
  homeOutline, briefcaseOutline, businessOutline, pinOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-my-addrass',
  templateUrl: './my-addrass.page.html',
  styleUrls: ['./my-addrass.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon]
})
export class MyAddrassPage implements OnInit {
  addresses: any[] = [];

  constructor(private router: Router, private alertCtrl: AlertController) {
    addIcons({ 
      arrowBack, location, 'add-circle-outline': addCircleOutline, 
      'map-outline': mapOutline, 'home-outline': homeOutline, 
      'briefcase-outline': briefcaseOutline, 'business-outline': businessOutline, 
      'pin-outline': pinOutline 
    });
  }

  ngOnInit() {
    this.loadData();
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    const data = localStorage.getItem('addresses');
    this.addresses = data ? JSON.parse(data) : [];
  }

  goToPickMap() {
    this.router.navigate(['/pick-map']);
  }

  editAddress(item: any, index: number) {
    let navigationExtras: NavigationExtras = {
      queryParams: { editIndex: index, title: item.title, detail: item.detail, mode: 'edit' }
    };
    this.router.navigate(['/pick-map'], navigationExtras);
  }

  async deleteAddress(item: any) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Address?',
      message: 'Kya aap isay khatam karna chahte hain?',
      buttons: [
        { text: 'Nahi', role: 'cancel' },
        {
          text: 'Delete',
          handler: () => {
            this.addresses = this.addresses.filter(a => a !== item);
            localStorage.setItem('addresses', JSON.stringify(this.addresses));
          }
        }
      ]
    });
    await alert.present();
  }

  getIcon(title: string): string {
    switch (title) {
      case 'Home': return 'home-outline';
      case 'Work': return 'briefcase-outline';
      case 'Office': return 'business-outline';
      default: return 'pin-outline';
    }
  }

  goToPage(path: string) {
    this.router.navigate([path]);
  }
}