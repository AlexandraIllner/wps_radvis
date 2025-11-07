import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Formular } from './formular';
import { ApiService } from '../core/globalService/api.services';
import { of, throwError } from 'rxjs';

describe('Formular Component', () => {
  let component: Formular;
  let fixture: ComponentFixture<Formular>;
  let apiService: ApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Formular, // Standalone Component
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Formular);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    spyOn(apiService, 'getIssue').and.returnValue(of({})); // Mock observable
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

    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeTrue();
  });

  it('Button sollte enabled sein, wenn Beschreibung vorhanden ist', () => {
    component.selectedCategory = null;
    component.description = 'Ein Test';
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeFalse();
  });

  it('Button sollte enabled sein, wenn Kategorie vorhanden ist', () => {
    component.selectedCategory = 'SCHLAGLOCH';
    component.description = '';
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeFalse();
  });

  // --------------------------
  // SubmitReport
  // --------------------------
  it('sollte Alert zeigen, wenn keine Kategorie ausgewählt ist', () => {
    spyOn(window, 'alert');

    component.selectedCategory = null;
    component.description = '';
    component.submitReport();

    expect(window.alert).toHaveBeenCalledWith(
      'Bitte wähle eine Kategorie oder gib eine Beschreibung ein!',
    );
  });

  it('sollte Report ans Backend senden', fakeAsync(() => {
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
    spyOn(apiService, 'createReport').and.returnValue(throwError(() => new Error('Fehler')));
    spyOn(console, 'error');

    component.selectedCategory = 'SCHLAGLOCH';
    component.description = 'Fehler-Test';
    component.submitReport();

    tick();

    expect(apiService.createReport).toHaveBeenCalled();
    expect(component.isLoading()).toBeFalse();
  }));
});
