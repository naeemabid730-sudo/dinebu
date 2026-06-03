import { Injectable } from '@angular/core';
import { doc, onSnapshot } from 'firebase/firestore'; // Firebase imports
import { db } from '../firebase.config'; // Aik dafa ../ kyunke order folder se bahar nikalte hi config mil jayegi
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor() { }

  trackOrderLive(orderId: string) {
    console.log('🛰️ Monitoring Order:', orderId);
    const orderRef = doc(db, 'orders', orderId);

    onSnapshot(orderRef, (docSnap) => {
      if (docSnap.exists()) {
        const status = docSnap.data()['status'];
        console.log('🔔 Status Change:', status);

        if (status === 'Delivered' || status === 'Out for Delivery') {
          alert(`DineBux Update: Aapka order ab "${status}" ho gaya hai! 🍔`);
        }
      }
    });
  }
}