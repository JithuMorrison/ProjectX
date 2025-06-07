import { TestBed } from '@angular/core/testing';

import { Relog } from './relog';

describe('Relog', () => {
  let service: Relog;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Relog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
