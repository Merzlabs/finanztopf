import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CategoryAssignComponent } from './category-assign.component';
import { ComponentsModule } from '../components.module';

describe('CategoryAssignComponent', () => {
  let component: CategoryAssignComponent;
  let fixture: ComponentFixture<CategoryAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryAssignComponent ],
      imports: [IonicModule.forRoot(), ComponentsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
