import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BankingPage } from './banking.page';
import { RouterModule } from '@angular/router';

describe('BankingPage', () => {
  let component: BankingPage;
  let fixture: ComponentFixture<BankingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankingPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(BankingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
