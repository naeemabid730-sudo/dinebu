import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    // ✅ FIXED: Wapas default path ko 'home' kar diya hai taake app normal chalay
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'menu',
    loadComponent: () => import('./menu/menu.page').then( m => m.MenuPage)
  },
  {
    path: 'menu2',
    loadComponent: () => import('./menu2/menu2.page').then( m => m.Menu2Page)
  },
  {
    path: 'my-cart',
    loadComponent: () => import('./my-cart/my-cart.page').then( m => m.MyCartPage)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./checkout/checkout.page').then( m => m.CheckoutPage)
  },
  {
    path: 'my-orders',
    loadComponent: () => import('./my-orders/my-orders.page').then( m => m.MyOrdersPage)
  },
  {
    path: 'account',
    loadComponent: () => import('./account/account.page').then( m => m.AccountPage)
  },
  {
    path: 'create-account',
    loadComponent: () => import('./create-account/create-account.page').then( m => m.CreateAccountPage)
  },
  {
    path: 'details',
    loadComponent: () => import('./details/details.page').then( m => m.DetailsPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'my-addrass',
    loadComponent: () => import('./my-addrass/my-addrass.page').then( m => m.MyAddrassPage)
  },
  {
    path: 'pick-map',
    loadComponent: () => import('./pick-map/pick-map.page').then( m => m.PickMapPage)
  },
  {
    path: 'edit-profile',
    loadComponent: () => import('./edit-profile/edit-profile.page').then( m => m.EditProfilePage)
  },
  {
    path: 'search',
    loadComponent: () => import('./search/search.page').then( m => m.SearchPage)
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.page').then( m => m.AdminPage)
  },
  {
    path: 'order-details',
    loadComponent: () => import('./order-details/order-details.page').then( m => m.OrderDetailsPage)
  },
  {
    path: 'order-tracking',
    loadComponent: () => import('./order-tracking/order-tracking.page').then( m => m.OrderTrackingPage)
  },
  {
    path: 'admin-dashboard',
    loadComponent: () => import('./admin-dashboard/admin-dashboard.page').then( m => m.AdminDashboardPage)
  },
  {
    path: 'information',
    loadComponent: () => import('./information/information.page').then( m => m.InformationPage)
  },
  {
    path: 'payment',
    loadComponent: () => import('./payment/payment.page').then( m => m.PaymentPage)
  },
  {
    path: 'shipping',
    loadComponent: () => import('./shipping/shipping.page').then( m => m.ShippingPage)
  },
  {
    path: 'address',
    loadComponent: () => import('./address/address.page').then( m => m.AddressPage)
  },
  {
    path: 'order-status',
    loadComponent: () => import('./order-status/order-status.page').then( m => m.OrderStatusPage)
  },
  {
    path: 'notification-test',
    loadComponent: () => import('./pages/notification-test/notification-test.page').then(m => m.NotificationTestPage)
  },
 
  
];