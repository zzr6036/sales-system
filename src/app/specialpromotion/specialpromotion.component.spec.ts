import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialpromotionComponent } from './specialpromotion.component';

describe('SpecialpromotionComponent', () => {
  let component: SpecialpromotionComponent;
  let fixture: ComponentFixture<SpecialpromotionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialpromotionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialpromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
