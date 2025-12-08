import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Formular } from './formular';
import { ApiService } from '../core/globalService/api.services';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('Formular Component', () => {
  let component: Formular;
  let fixture: ComponentFixture<Formular>;
  let apiService: ApiService;
  function mockKarte(component: any, coords: { lat: number; lng: number } | null) {
    component.karte = {
      getCoordinates: () => coords,
    };
  }

  function callSubmitAndParseReport(
    component: any,
    apiService: ApiService,
    response: any = {}
  ) {
    const createSpy = spyOn(apiService, 'createReport').and.returnValue(of(response));
    component.submitReport();
    return createSpy;
  }

  function extractReportObject(createSpy: jasmine.Spy, cb: (obj: any) => void) {
    const formDataSent = createSpy.calls.first().args[0] as FormData;
    const blob = formDataSent.get('report') as Blob;

    blob.text().then((json) => cb(JSON.parse(json)));
  }

  beforeEach(async () => {
    const snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        Formular, // Standalone Component
        HttpClientTestingModule,
      ],
      providers: [{ provide: MatSnackBar, useValue: snackBarMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Formular);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);

    // HINWEIS: Der Mock für 'karte' wurde aus dem beforeEach entfernt,
    // da er nicht stabil war und in den individuellen Tests, die submitReport aufrufen,
    // neu gesetzt wird, um Race Conditions mit @ViewChild zu vermeiden.

    spyOn(apiService, 'getIssue').and.returnValue(of([])); // <--- CATEGORÍAS VACÍAS
    fixture.detectChanges();
  });

  // --------------------------
  // Basis
  // --------------------------
  it('sollte erstellt werden', () => {
    expect(component).toBeTruthy();
  });

  // --------------------------
  // Validierung: Beschreibung ODER Kategorie
  // --------------------------
  it('Button sollte disabled sein, wenn keine Kategorie und keine Beschreibung gesetzt sind', () => {
    component.selectedCategory = null;
    component.description = '';
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('#submit-btn');

    // Angular Material markiert disabled mit dieser Klasse
    expect(button.classList.contains('mat-mdc-button-disabled')).toBeTrue();
  });

  it('Button sollte enabled sein, wenn Beschreibung vorhanden ist', () => {
    component.selectedCategory = null;
    component.description = 'Ein Test';
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.hasAttribute('disabled')).toBeFalse(); // FIX
  });

  it('Button sollte enabled sein, wenn Kategorie vorhanden ist', () => {
    component.selectedCategory = 'SCHLAGLOCH';
    component.description = '';
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.hasAttribute('disabled')).toBeFalse(); // FIX
  });

  // --------------------------
  // SubmitReport
  // --------------------------
  it('sollte Alert zeigen, wenn keine Kategorie ausgewählt ist', () => {
    // Mock für die Abhängigkeit 'karte' in diesem Testblock setzen
    (component as any).karte = {
      getCoordinates: () => ({ lat: 0, lng: 0 }),
    } as any;

    spyOn(window, 'alert');

    component.selectedCategory = null;
    component.description = '';

    component.submitReport();

    expect(window.alert).toHaveBeenCalledWith(
      'Bitte wähle eine Kategorie oder gib eine Beschreibung ein!',
    );
  });

  it('sollte Report ans Backend senden', fakeAsync(() => {
    (component as any).karte = {
      getCoordinates: () => ({ lat: 0, lng: 0 }),
    } as any;

    const mockResponse = { id: 1, issue: 'SCHLAGLOCH' };
    spyOn(apiService, 'createReport').and.returnValue(of(mockResponse));

    component.selectedCategory = 'SCHLAGLOCH';
    component.description = 'Test';
    component.submitReport();

    tick(); // Wartet auf async Operationen

    expect(apiService.createReport).toHaveBeenCalled();
    expect(component.selectedCategory).toBeNull();
    expect(component.description).toBe('');
  }));

  it('sollte isLoading auf false setzen, wenn API-Fehler auftritt', fakeAsync(() => {
    (component as any).karte = {
      getCoordinates: () => ({ lat: 52.5, lng: 13.4 }),
    } as any;

    spyOn(apiService, 'createReport').and.returnValue(throwError(() => new Error('Fehler')));
    spyOn(console, 'error');

    component.selectedCategory = 'SCHLAGLOCH';
    component.description = 'Fehler-Test';

    component.submitReport();

    expect(apiService.createReport).toHaveBeenCalled();
    expect(component.isLoading()).toBeFalse();
  }));

  it('T5.23 Formular sollte auch ohne Koordinaten gültig sein', () => {
    component.selectedFiles = [];
    component.selectedCategory = 'SCHLAGLOCH';
    component.description = 'Test ohne Standort';

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('#submit-btn');

    expect(button.disabled).toBeFalse();
  });

  it('soll Fotos aus onPhotoAdded und onPhotosSelected ohne Duplikate zusammenführen', () => {
    const f1 = new File(['aaa'], '1.jpg', { type: 'image/jpeg' });
    const f2 = new File(['bbb'], '2.jpg', { type: 'image/jpeg' });
    const f2Duplicate = new File(['bbb'], '2.jpg', { type: 'image/jpeg' });

    // Startzustand
    component.selectedFiles = [];

    // Foto aus Kamera
    component.onPhotoAdded(f1);

    // Fotos aus Upload (eins davon Duplikat)
    component.onPhotosSelected([f2, f2Duplicate]);

    const names = component.selectedFiles.map((f) => f.name);

    expect(component.selectedFiles.length).toBe(2);
    expect(names).toContain('1.jpg');
    expect(names).toContain('2.jpg');
  });

  it('T5.24: submitReport darf NICHT senden, wenn Kategorie UND Beschreibung fehlen', () => {
    (component as any).karte = {
      getCoordinates: () => null,
    };

    spyOn(window, 'alert');
    spyOn(apiService, 'createReport');

    component.selectedCategory = null;
    component.description = '';

    component.submitReport();

    expect(window.alert).toHaveBeenCalled();
    expect(apiService.createReport).not.toHaveBeenCalled();
  });
  it('T5.25.1: sollte Koordinaten in FormData übernehmen', (done) => {
    mockKarte(component, { lat: 12.3, lng: 45.6 });

    component.selectedCategory = 'SCHLAGLOCH';
    component.description = 'Test';

    const createSpy = callSubmitAndParseReport(component, apiService);

    extractReportObject(createSpy, (obj) => {
      expect(obj.latitude).toBe(12.3);
      expect(obj.longitude).toBe(45.6);
      done();
    });
  });
  it('T5.25.2: sollte null senden wenn keine Koordinaten gesetzt sind', (done) => {
    mockKarte(component, null);

    component.selectedCategory = 'SCHLAGLOCH';
    component.description = 'Test';

    const createSpy = callSubmitAndParseReport(component, apiService);

    extractReportObject(createSpy, (obj) => {
      expect(obj.latitude).toBeNull();
      expect(obj.longitude).toBeNull();
      done();
    });
  });

});
