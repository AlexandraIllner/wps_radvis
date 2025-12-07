import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.services';
import { environment } from '../../../enviroments/enviroment';

// -------------------------------------------
// Typing
// -------------------------------------------
interface ReportData {
  issue: string;
  description: string;
  latitude: number;
  longitude: number;
}

// -------------------------------------------
// Shared Test Helpers (no duplication)
// -------------------------------------------
function createReportObject(): ReportData {
  return {
    issue: 'SCHLAGLOCH',
    description: 'Großes Loch',
    latitude: 52.52,
    longitude: 13.405,
  };
}

function createFormData(report: ReportData): FormData {
  const fd = new FormData();
  fd.append(
    'report',
    new Blob([JSON.stringify(report)], { type: 'application/json' })
  );
  return fd;
}

function expectBasicPostRequest(req: any) {
  expect(req.request.method).toBe('POST');
  expect(req.request.body instanceof FormData).toBeTrue();
}

async function extractReport(req: any): Promise<ReportData> {
  const blob = req.request.body.get('report') as Blob;
  const text = await blob.text();
  return JSON.parse(text);
}

/**
 * Runs the core POST workflow once:
 * - builds report
 * - sends request
 * - intercepts request
 * - extracts sent report
 * - passes extracted report to assertion callback
 */
async function runReportTest(
  service: ApiService,
  httpMock: HttpTestingController,
  assertionCb: (sent: ReportData) => void
) {
  const report = createReportObject();
  const formData = createFormData(report);
  const mockResponse = { id: 1, ...report };

  service.createReport(formData).subscribe((res) => {
    expect(res.id).toBe(1);
    expect(res.issue).toBe('SCHLAGLOCH');
  });

  const req = httpMock.expectOne(`${environment.apiUrl}/api/reports`);
  expectBasicPostRequest(req);

  const sent = await extractReport(req);

  assertionCb(sent);

  req.flush(mockResponse);
}

// -------------------------------------------
// Assertion Logic (unique => no jscpd clone)
// -------------------------------------------
function basicAssertions(sent: ReportData) {
  expect(sent.issue).toBe('SCHLAGLOCH');
  expect(sent.description).toBe('Großes Loch');
}

function strictAssertions(sent: ReportData) {
  basicAssertions(sent);
  expect(sent.latitude).toBe(52.52);
  expect(sent.longitude).toBe(13.405);
}

// -------------------------------------------
// TEST SUITE
// -------------------------------------------
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

  // -------------------------
  // BASIC TESTS
  // -------------------------
  it('sollte erstellt werden', () => {
    expect(service).toBeTruthy();
  });

  it('sollte Issues vom Backend holen (GET)', () => {
    const mockIssues = ['SCHLAGLOCH', 'BEWUCHS'];

    service.getIssue().subscribe((issues: string[]) => {
      expect(issues.length).toBe(2);
      expect(issues[0]).toBe('SCHLAGLOCH');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/issues`);
    expect(req.request.method).toBe('GET');

    req.flush(mockIssues);
  });

  // -------------------------
  // POST TEST 1 (uses helper)
  // -------------------------
  it('sollte Report ans Backend senden (POST)', async () => {
    await runReportTest(service, httpMock, basicAssertions);
  });

  // -------------------------
  // POST TEST 2 (unique logic)
  // -------------------------
  it('T5.26: sollte Report korrekt per POST senden', async () => {
    await runReportTest(service, httpMock, strictAssertions);
  });
});
