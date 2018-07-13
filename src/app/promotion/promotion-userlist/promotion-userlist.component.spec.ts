import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionUserlistComponent } from './promotion-userlist.component';

describe('PromotionUserlistComponent', () => {
  let component: PromotionUserlistComponent;
  let fixture: ComponentFixture<PromotionUserlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionUserlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionUserlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
