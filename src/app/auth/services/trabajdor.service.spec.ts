import { TestBed } from '@angular/core/testing';

import { TrabajdorService } from './trabajdor.service';

describe('TrabajdorService', () => {
  let service: TrabajdorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrabajdorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
