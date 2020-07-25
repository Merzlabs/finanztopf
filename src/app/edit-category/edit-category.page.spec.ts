import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCategoryPage } from './edit-category.page';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

describe('EditCategoryPage', () => {
  let component: EditCategoryPage;
  let fixture: ComponentFixture<EditCategoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCategoryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])],
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
