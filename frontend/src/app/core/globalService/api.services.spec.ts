import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.services';
import { environment } from '../../../enviroments/enviroment';

// -------------------------------------------
// Shared Test Helpers (delete duplicates)
// -------------------------------------------
function createReportObject() {
  return {
    issue: 'SCHLAGLOCH',
    description: 'Großes Loch',
    latitude: 52.52,
    longitude: 13.405,
  };
}

function createFormData(reportObject: any): FormData {
  const formData = new FormData();
  formData.append(
    'report',
    new Blob([JSON.stringify(reportObject)], { type: 'application/json' })
  );
  return formData;
}

async function extractReport(req: any) {
  const blob = req.request.body.get('report') as Blob;
  const text = await blob.text();
  return JSON.parse(text);
}

function expectBasicPostRequest(req: any) {
  expect(req.request.method).toBe('POST');
  expect(req.request.body instanceof FormData).toBeTrue();
}

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('sollte erstellt werden', () => {
    expect(service).toBeTruthy();
  });

  it('sollte Issues vom Backend holen (GET)', () => {
    const mockIssues = ['SCHLAGLOCH', 'BEWUCHS'];

    service.getIssue().subscribe((issues: any[]) => {
      expect(issues.length).toBe(2);
      expect(issues[0]).toBe('SCHLAGLOCH');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/issues`);
    expect(req.request.method).toBe('GET');

    req.flush(mockIssues);
  });

  // -------------------------
  // POST TEST 1 (Refactored)
  // -------------------------
  it('sollte Report ans Backend senden (POST)', async () => {
    const reportObject = createReportObject();
    const formData = createFormData(reportObject);
    const mockResponse = { id: 1, ...reportObject };

    service.createReport(formData).subscribe((response) => {
      expect(response.id).toBe(1);
      expect(response.issue).toBe('SCHLAGLOCH');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/reports`);
    expectBasicPostRequest(req);

    const sentData = await extractReport(req);
    expect(sentData.issue).toBe('SCHLAGLOCH');
    expect(sentData.description).toBe('Großes Loch');

    req.flush(mockResponse);
  });

  // -------------------------
  // POST TEST 2 (Refactored)
  // -------------------------
  it('T5.26: sollte Report korrekt per POST senden', async () => {
    const reportObject = createReportObject();
    const formData = createFormData(reportObject);
    const mockResponse = { id: 1, ...reportObject };

    service.createReport(formData).subscribe((response) => {
      expect(response.id).toBe(1);
      expect(response.issue).toBe('SCHLAGLOCH');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/reports`);
    expectBasicPostRequest(req);

    const sentData = await extractReport(req);

    expect(sentData.issue).toBe('SCHLAGLOCH');
    expect(sentData.description).toBe('Großes Loch');
    expect(sentData.latitude).toBe(52.52);
    expect(sentData.longitude).toBe(13.405);

    req.flush(mockResponse);
  });
});
