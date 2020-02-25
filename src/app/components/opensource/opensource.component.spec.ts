import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpensourceComponent } from './opensource.component';

describe('OpensourceComponent', () => {
  let component: OpensourceComponent;
  let fixture: ComponentFixture<OpensourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpensourceComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpensourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
