import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AssignPage } from './assign.page';

describe('AssignPage', () => {
  let component: AssignPage;
  let fixture: ComponentFixture<AssignPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AssignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
