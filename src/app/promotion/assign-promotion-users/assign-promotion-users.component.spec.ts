import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPromotionUsersComponent } from './assign-promotion-users.component';

describe('AssignPromotionUsersComponent', () => {
  let component: AssignPromotionUsersComponent;
  let fixture: ComponentFixture<AssignPromotionUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignPromotionUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPromotionUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
