import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// Firebase Imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideMessaging, getMessaging } from '@angular/fire/messaging'; 
import { provideFirestore, getFirestore } from '@angular/fire/firestore'; // ✅ Yeh import add kiya
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    
    // Firebase App Initialization
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    
    // Firebase Services Providers
    provideAuth(() => getAuth()),
    provideMessaging(() => getMessaging()), 
    provideFirestore(() => getFirestore()), // ✅ Yeh provider add kiya
    provideHttpClient(),
  ],
});