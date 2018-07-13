import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateuserViewComponent } from './createuser-view.component';

describe('CreateuserViewComponent', () => {
  let component: CreateuserViewComponent;
  let fixture: ComponentFixture<CreateuserViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateuserViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateuserViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
