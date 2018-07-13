import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionCodeComponent } from './promotion-code.component';

describe('PromotionCodeComponent', () => {
  let component: PromotionCodeComponent;
  let fixture: ComponentFixture<PromotionCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
