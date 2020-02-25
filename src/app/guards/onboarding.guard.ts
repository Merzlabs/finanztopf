import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OnboardingGuard implements CanActivate {

  constructor(private router: Router) {

  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const completedOnboarding = localStorage.getItem('onboardingDone') === 'true';

    if (!completedOnboarding) {
      this.router.navigateByUrl('/onboarding');
    }

    return completedOnboarding;
  }
}
