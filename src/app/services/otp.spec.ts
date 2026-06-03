import { TestBed } from '@angular/core/testing';

import { Otp } from './otp';

describe('Otp', () => {
  let service: Otp;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Otp);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
