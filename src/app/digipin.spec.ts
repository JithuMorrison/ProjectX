import { TestBed } from '@angular/core/testing';

import { Digipin } from './digipin';

describe('Digipin', () => {
  let service: Digipin;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Digipin);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
