importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCwG0jVdwk3uYg4shro768c2qqEs419he0",
  authDomain: "dinebu-8e705.firebaseapp.com",
  projectId: "dinebu-8e705",
  storageBucket: "dinebu-8e705.firebasestorage.app",
  messagingSenderId: "116841893564",
  appId: "1:116841893564:web:4b5c67153380a60db0cab9"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('📩 Background message:', payload);

  // Fallback data structure agar notification object direct na mile
  const title = payload.notification?.title || payload.data?.title || 'DineBux';
  const body = payload.notification?.body || payload.data?.body || 'Naya message receive hua hai!';

  const notificationOptions = {
    body: body,
    icon: 'assets/q1.png', // Leading slash hata diya taake relative path issues na hon
    badge: 'assets/q1.png',
    vibrate: [200, 100, 200],
    data: payload.data // Taake agar click par order page kholna ho toh data mile
  };

  self.registration.showNotification(title, notificationOptions);
});