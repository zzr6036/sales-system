import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialpromotionCodeComponent } from './specialpromotion-code.component';

describe('SpecialpromotionCodeComponent', () => {
  let component: SpecialpromotionCodeComponent;
  let fixture: ComponentFixture<SpecialpromotionCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialpromotionCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialpromotionCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
