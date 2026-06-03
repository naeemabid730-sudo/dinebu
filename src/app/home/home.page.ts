import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // ✅ Router import kiya
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonContent],
})
export class HomePage implements OnInit {

  // ✅ Router ko constructor mein inject karein
  constructor(private router: Router) {}

  ngOnInit() {
    // ✅ 3000ms matlab 3 seconds baad function chalay ga
    setTimeout(() => {
      this.goToNextPage();
    }, 3000); 
  }

  goToNextPage() {
    // ✅ Yahan apne next page ka path likhein (e.g., 'menu2' ya 'login')
    this.router.navigate(['/menu']); 
  }
}