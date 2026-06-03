import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonIcon, 
  IonButton, 
  IonModal, 
  IonSearchbar, 
  Platform 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  chevronBackOutline, 
  personOutline, 
  callOutline, 
  locationOutline, 
  camera, 
  mailOutline, 
  arrowForward, 
  closeOutline, 
  trashOutline,
  cameraOutline, 
  imageOutline, 
  logoFacebook, 
  sparklesOutline,
  searchOutline 
} from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  imports: [
    CommonModule, 
    FormsModule, 
    IonContent, 
    IonIcon, 
    IonButton, 
    IonModal, 
    IonSearchbar
  ]
})
export class EditProfilePage implements OnInit {

  // User Information Variables
  name: string = 'Ahmad';
  phone: string = '';
  email: string = '';
  address: string = '';
  profileImage: string | null = null;
  
  // UI Control Variables
  isModalOpen: boolean = false;
  showAIView: boolean = false; 
  aiSearchQuery: string = '';

  // AI Avatars List
  aiImages: string[] = [];

  constructor(private router: Router, private platform: Platform) {
    // Icons Registration
    addIcons({ 
      chevronBackOutline, 
      personOutline, 
      callOutline, 
      locationOutline, 
      camera, 
      mailOutline, 
      arrowForward, 
      closeOutline, 
      trashOutline,
      cameraOutline, 
      imageOutline, 
      logoFacebook, 
      sparklesOutline,
      searchOutline
    });
  }

  ngOnInit() {
    this.loadCurrentData();
    this.generateAIImages(); // Screen load hote hi default images show hon
  }

  loadCurrentData() {
    this.name = localStorage.getItem('userName') || 'Ahmad';
    this.phone = localStorage.getItem('userPhone') || '03269691867';
    this.email = localStorage.getItem('userEmail') || 'ahmad@example.com';
    this.profileImage = localStorage.getItem('userPhoto');
    
    const savedAddress = localStorage.getItem('userAddress');
    this.address = savedAddress || 'Pakpattan, Punjab, Pakistan';
  }

  // --- Updated AI Image Generator Logic (15 Images with Multiple Styles) ---
  generateAIImages() {
    const query = this.aiSearchQuery.trim() || 'avatar';
    this.aiImages = [];

    // DiceBear ke different collections use kar rahe hain variety ke liye
    const styles = [
      'avataaars', 
      'bottts', 
      'pixel-art', 
      'multiavatar', 
      'adventurer', 
      'big-ears', 
      'lorelei', 
      'notionists', 
      'open-peeps'
    ];
    
    for (let i = 0; i < 15; i++) {
      // Loop ke zariye style change hota rahega
      const styleIndex = i % styles.length;
      const currentStyle = styles[styleIndex];
      
      // Unique seed banaya taake har box me alag image aye
      const imageUrl = `https://api.dicebear.com/7.x/${currentStyle}/svg?seed=${query}-${i}`;
      this.aiImages.push(imageUrl);
    }
  }

  async takePhoto() {
    this.isModalOpen = false;
    if (this.platform.is('hybrid')) {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera
        });
        this.profileImage = image.dataUrl || null;
      } catch (error) {
        console.error('Camera error:', error);
      }
    } else {
      this.triggerFileSelect();
    }
  }

  async pickImage() {
    this.isModalOpen = false;
    if (this.platform.is('hybrid')) {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Photos
        });
        this.profileImage = image.dataUrl || null;
      } catch (error) {
        console.error('Gallery error:', error);
      }
    } else {
      this.triggerFileSelect();
    }
  }

  triggerFileSelect() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  fromAI() {
    this.showAIView = true;
  }

  selectAIImage(imgUrl: string) {
    this.profileImage = imgUrl;
    this.closeModal();
  }

  deletePhoto() {
    this.profileImage = null;
    this.isModalOpen = false;
  }

  fromFacebook() {
    window.open('https://facebook.com', '_blank');
    this.isModalOpen = false;
  }

  closeModal() {
    this.isModalOpen = false;
    setTimeout(() => {
      this.showAIView = false;
      this.aiSearchQuery = ''; 
      this.generateAIImages(); // Reset to default on close
    }, 300);
  }

  save() {
    if (this.profileImage) {
      localStorage.setItem('userPhoto', this.profileImage);
    }
    localStorage.setItem('userName', this.name);
    localStorage.setItem('userPhone', this.phone);
    localStorage.setItem('userEmail', this.email);
    localStorage.setItem('userAddress', this.address);

    console.log('Profile Updated Successfully!');
    this.router.navigate(['/profile']);
  }

  cancel() {
    this.router.navigate(['/profile']);
  }
}