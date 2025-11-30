import {TestBed} from '@angular/core/testing';
import {ApiService} from './api.services';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
  });

  it('sollte erstellt werden', () => {
    expect(service).toBeTruthy();
  });
});
