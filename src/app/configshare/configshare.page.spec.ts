import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConfigsharePage } from './configshare.page';

describe('ConfigsharePage', () => {
  let component: ConfigsharePage;
  let fixture: ComponentFixture<ConfigsharePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigsharePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigsharePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
