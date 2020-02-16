import { TestBed } from '@angular/core/testing';

import { FileCacheService } from './file-cache.service';

describe('FileCacheService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileCacheService = TestBed.get(FileCacheService);
    expect(service).toBeTruthy();
  });
});
