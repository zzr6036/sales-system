import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPromotionTimesComponent } from './assign-promotion-times.component';

describe('AssignPromotionTimesComponent', () => {
  let component: AssignPromotionTimesComponent;
  let fixture: ComponentFixture<AssignPromotionTimesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignPromotionTimesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPromotionTimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
