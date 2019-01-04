import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivePromocodeComponent } from './active-promocode.component';

describe('ActivePromocodeComponent', () => {
  let component: ActivePromocodeComponent;
  let fixture: ComponentFixture<ActivePromocodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivePromocodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivePromocodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
