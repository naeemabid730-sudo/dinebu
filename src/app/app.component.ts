import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { PushNotificationService } from './services/notification.service'; 

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {

  constructor(private pushService: PushNotificationService) {
    this.initializeApp();
  }

  initializeApp() {
    console.log('DineBux App Root Initialized Successfully! 🚀');
    
    // ✅ initMobilePush ki jagah initPush use karo
    this.pushService.initPush('test_user_123');
  }
}