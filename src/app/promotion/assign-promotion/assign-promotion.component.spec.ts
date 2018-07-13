import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPromotionComponent } from './assign-promotion.component';

describe('AssignPromotionComponent', () => {
  let component: AssignPromotionComponent;
  let fixture: ComponentFixture<AssignPromotionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignPromotionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
