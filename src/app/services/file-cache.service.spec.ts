import { TestBed } from '@angular/core/testing';

import { FileCacheService } from './file-cache.service';
import { NgxIndexedDBService, NgxIndexedDBModule } from 'ngx-indexed-db';
import { AppModule } from '../app.module';

describe('FileCacheService', () => {
  beforeEach(() => TestBed.configureTestingModule({imports: [NgxIndexedDBModule.forRoot(AppModule.dbConfig)]}));

  it('should be created', () => {
    const service: FileCacheService = TestBed.inject(FileCacheService);
    expect(service).toBeTruthy();
  });
});
