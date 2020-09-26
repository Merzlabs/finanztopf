import { TestBed } from '@angular/core/testing';

import { X2saService } from './x2sa.service';

describe('X2saService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: X2saService = TestBed.inject(X2saService);
    expect(service).toBeTruthy();
  });
});
