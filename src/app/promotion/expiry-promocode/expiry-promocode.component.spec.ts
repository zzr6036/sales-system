import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiryPromocodeComponent } from './expiry-promocode.component';

describe('ExpiryPromocodeComponent', () => {
  let component: ExpiryPromocodeComponent;
  let fixture: ComponentFixture<ExpiryPromocodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiryPromocodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiryPromocodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
