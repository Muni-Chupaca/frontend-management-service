import { TestBed } from '@angular/core/testing';

import { AuthorizedvehicleService } from './authorizedvehicle.service';

describe('AuthorizedvehicleService', () => {
  let service: AuthorizedvehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorizedvehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
