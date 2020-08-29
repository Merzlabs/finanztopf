import { TestBed } from '@angular/core/testing';

import { X2saService } from './x2sa.service';
import { AppModule } from 'src/app/app.module';
import { NgxIndexedDBModule } from 'ngx-indexed-db';

describe('X2saService', () => {
  beforeEach(() => TestBed.configureTestingModule({imports: [NgxIndexedDBModule.forRoot(AppModule.dbConfig)]}));

  it('should be created', () => {
    const service: X2saService = TestBed.inject(X2saService);
    expect(service).toBeTruthy();
  });
});
