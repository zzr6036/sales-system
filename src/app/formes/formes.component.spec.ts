import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormesComponent } from './formes.component';

describe('FormesComponent', () => {
  let component: FormesComponent;
  let fixture: ComponentFixture<FormesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
