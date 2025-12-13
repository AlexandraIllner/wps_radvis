import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.services';
import { environment } from '../../../enviroments/enviroment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  // Wird vor jedem Test ausgeführt
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Fake HTTP für Tests
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Nach jedem Test prüfen ob keine offenen HTTP-Requests existieren
  afterEach(() => {
    httpMock.verify();
  });

  // Test 1: Service wird erstellt
  it('sollte erstellt werden', () => {
    expect(service).toBeTruthy();
  });

  // Test 2: GET Request funktioniert
  it('sollte Issues vom Backend holen (GET)', () => {
    const mockIssues = ['SCHLAGLOCH', 'BEWUCHS'];

    // Führe getIssue() aus
    service.getIssue().subscribe((issues: string | any[]) => {
      expect(issues.length).toBe(2);
      expect(issues[0]).toBe('SCHLAGLOCH');
    });

    // Prüfe ob richtiger Request gemacht wurde
    const req = httpMock.expectOne(`${environment.apiUrl}/api/issues`);
    expect(req.request.method).toBe('GET');

    // Simuliere Backend-Antwort
    req.flush(mockIssues);
  });

  it('sollte Report ans Backend senden (POST)', async () => {
    const formData = new FormData();
    const reportObject = {
      issue: 'SCHLAGLOCH',
      description: 'Großes Loch',
      latitude: 52.52,
      longitude: 13.405,
    };

    formData.append(
      'report',
      new Blob([JSON.stringify(reportObject)], { type: 'application/json' }),
    );

    const mockResponse = { id: 1, ...reportObject };

    service.createReport(formData).subscribe((response) => {
      expect(response.id).toBe(1);
      expect(response.issue).toBe('SCHLAGLOCH');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/reports`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();

    const sentBlob = req.request.body.get('report') as Blob;
    expect(sentBlob).toBeTruthy();

    const text = await sentBlob.text();
    const data = JSON.parse(text);

    expect(data.issue).toBe('SCHLAGLOCH');
    expect(data.description).toBe('Großes Loch');

    req.flush(mockResponse);
  });

  // -------------------------------------------------
  // T5.26 – stricter version: full field validation
  // -------------------------------------------------
  it('T5.26: sollte Report korrekt per POST senden', async () => {
    const formData = new FormData();

    const reportObject = {
      issue: 'SCHLAGLOCH',
      description: 'Großes Loch',
      latitude: 52.52,
      longitude: 13.405,
    };

    formData.append(
      'report',
      new Blob([JSON.stringify(reportObject)], { type: 'application/json' }),
    );

    const mockResponse = { id: 1, ...reportObject };

    service.createReport(formData).subscribe((response) => {
      expect(response.id).toBe(1);
      expect(response.issue).toBe('SCHLAGLOCH');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/reports`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();

    const blob = req.request.body.get('report') as Blob;
    expect(blob).toBeTruthy();

    const text = await blob.text();
    const sentData = JSON.parse(text);

    expect(sentData.issue).toBe('SCHLAGLOCH');
    expect(sentData.description).toBe('Großes Loch');
    expect(sentData.latitude).toBe(52.52);
    expect(sentData.longitude).toBe(13.405);

    req.flush(mockResponse);
  });
});
