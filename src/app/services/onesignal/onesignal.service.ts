import { Injectable } from '@angular/core';

declare var OneSignal: any;

@Injectable({
  providedIn: 'root'
})
export class OnesignalService {

  private playerId: string = '';

  async initOneSignal() {
    try {
      OneSignal.setAppId("bb6f5013-9733-4600-a122-dcb6b8eb4100");

      OneSignal.setNotificationOpenedHandler((jsonData: any) => {
        console.log('🔔 Notification opened:', JSON.stringify(jsonData));
      });

      OneSignal.promptForPushNotificationsWithUserResponse((accepted: boolean) => {
        console.log('✅ User accepted:', accepted);
        if (accepted) {
          this.fetchPlayerId();
        }
      });

      this.fetchPlayerId();

    } catch (error) {
      console.error('🔥 OneSignal Error:', error);
    }
  }

  private fetchPlayerId() {
    setTimeout(() => {
      try {
        OneSignal.getDeviceState((state: any) => {
          if (state?.userId) {
            this.playerId = state.userId;
            localStorage.setItem('onesignal_player_id', state.userId);
            console.log('✅ Player ID:', this.playerId);
          }
        });
      } catch (e) {
        try {
          OneSignal.getUserId((id: string) => {
            if (id) {
              this.playerId = id;
              localStorage.setItem('onesignal_player_id', id);
              console.log('✅ Player ID fallback:', id);
            }
          });
        } catch (e2) {
          console.log('❌ Player ID nahi mila');
        }
      }
    }, 3000);
  }

  getPlayerId(): string {
    if (this.playerId) return this.playerId;
    return localStorage.getItem('onesignal_player_id') || '';
  }
}