import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'redirect', redirectTo: 'tabs/tab1', pathMatch: 'full' },
  { path: 'edit-category', loadChildren: './edit-category/edit-category.module#EditCategoryPageModule' },
  { path: 'detail-category', loadChildren: './detail-category/detail-category.module#DetailCategoryPageModule' },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
  { path: 'onboarding', loadChildren: './onboarding/onboarding.module#OnboardingPageModule' },
  {
    path: 'assign',
    loadChildren: () => import('./assign/assign.module').then( m => m.AssignPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'share',
    loadChildren: () => import('./share/share.module').then( m => m.SharePageModule)
  },
  {
    path: 'banking',
    loadChildren: () => import('./banking/banking.module').then( m => m.BankingPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
