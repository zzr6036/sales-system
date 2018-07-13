import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedraftComponent } from './savedraft.component';

describe('SavedraftComponent', () => {
  let component: SavedraftComponent;
  let fixture: ComponentFixture<SavedraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedraftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
