import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateuserEditComponent } from './createuser-edit.component';

describe('CreateuserEditComponent', () => {
  let component: CreateuserEditComponent;
  let fixture: ComponentFixture<CreateuserEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateuserEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateuserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
