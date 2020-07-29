import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BankingPage } from './banking.page';

describe('BankingPage', () => {
  let component: BankingPage;
  let fixture: ComponentFixture<BankingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BankingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
