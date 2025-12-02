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
      imports: [HttpClientTestingModule],  // Fake HTTP für Tests
      providers: [ApiService]
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

  // Test 3: POST Request funktioniert
  it('sollte Report ans Backend senden (POST)', () => {
    // FormData korrekt aufbauen
    const formData = new FormData();
    const reportObject = {
      issue: 'SCHLAGLOCH',
      description: 'Großes Loch',
      latitude: 52.52,
      longitude: 13.405
    };

    formData.append(
      'report',
      new Blob([JSON.stringify(reportObject)], { type: 'application/json' })
    );

    // Mock Response
    const mockResponse = { id: 1, ...reportObject };

    // createReport aufrufen
    service.createReport(formData).subscribe(response => {
      expect(response.id).toBe(1);
      expect(response.issue).toBe('SCHLAGLOCH');
    });

    // Request abfangen
    const req = httpMock.expectOne(`${environment.apiUrl}/api/reports`);
    expect(req.request.method).toBe('POST');

    // Body KANN NICHT direkt verglichen werden, aber:
    expect(req.request.body instanceof FormData).toBeTrue();

    const sentReportBlob = req.request.body.get('report') as Blob;

    expect(sentReportBlob).toBeTruthy();

    // Blob → JSON parsen
    sentReportBlob.text().then(text => {
      const sentData = JSON.parse(text);
      expect(sentData.issue).toBe('SCHLAGLOCH');
    });

    // Backend simulieren
    req.flush(mockResponse);
  });
});
