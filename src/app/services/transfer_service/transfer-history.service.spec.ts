import { TestBed } from '@angular/core/testing';

import { TransferhistoryService } from './transfer-history.service';

describe('TransferHistoryService', () => {
  let service: TransferhistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferhistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
