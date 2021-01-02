import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { OnboardingGuard } from './onboarding.guard';
import { RouterModule } from '@angular/router';

describe('OnboardingGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OnboardingGuard],
      imports: [RouterModule.forRoot([], { relativeLinkResolution: 'legacy' })],
    });
  });

  it('should ...', inject([OnboardingGuard], (guard: OnboardingGuard) => {
    expect(guard).toBeTruthy();
  }));
});
