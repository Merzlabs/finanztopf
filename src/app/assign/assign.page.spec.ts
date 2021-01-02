import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AssignPage } from './assign.page';

describe('AssignPage', () => {
  let component: AssignPage;
  let fixture: ComponentFixture<AssignPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AssignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
});
