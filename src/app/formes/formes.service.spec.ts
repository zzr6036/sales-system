import { TestBed, inject } from '@angular/core/testing';

import { FormesService } from './formes.service';

describe('FormesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormesService]
    });
  });

  it('should be created', inject([FormesService], (service: FormesService) => {
    expect(service).toBeTruthy();
  }));
});
