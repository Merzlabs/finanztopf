import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditCategoryPage } from './edit-category.page';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

describe('EditCategoryPage', () => {
  let component: EditCategoryPage;
  let fixture: ComponentFixture<EditCategoryPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCategoryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([], { relativeLinkResolution: 'legacy' })],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCategoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
