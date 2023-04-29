import { TestBed } from '@angular/core/testing';

import { MyServiceProviderService } from './my-service-provider.service';

describe('MyServiceProviderService', () => {
  let service: MyServiceProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyServiceProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
