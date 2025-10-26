import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { App } from './app';
import { ApiService } from './core/globalService/api.services';
import { of } from 'rxjs';


describe('App Component', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let apiService: ApiService;

  // Wird vor jedem Test ausgeführt
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,  // Standalone Component
        HttpClientTestingModule,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
  });

  // Test 1: Component wird erstellt
  it('sollte erstellt werden', () => {
    expect(component).toBeTruthy();
  });

  // Test 2: Kategorien sind definiert
  it('sollte 8 Kategorien haben', () => {
    expect(component.categories.length).toBe(8);
    expect(component.categories[0]).toBe('SCHLAGLOCH');
  });

  // Test 3: formatCategory funktioniert
  it('sollte Kategorie formatieren', () => {
    const formatted = component.formatCategory('SCHLAGLOCH');
    expect(formatted).toBe('Schlagloch');

    const formatted2 = component.formatCategory('SCHLECHTER_STRASSENBELAG');
    expect(formatted2).toBe('Schlechter Strassenbelag');
  });

  // Test 4: submitReport ohne Kategorie zeigt Alert
  it('sollte Alert zeigen wenn keine Kategorie ausgewählt', () => {
    spyOn(window, 'alert');

    component.selectedCategory = null;
    component.submitReport();

    expect(window.alert).toHaveBeenCalledWith('Bitte wähle eine Kategorie aus!');
  });

  // Test 5: submitReport sendet Daten ans Backend
  it('sollte Report ans Backend senden', fakeAsync(() => {
    const mockResponse = { id: 1, issue: 'SCHLAGLOCH' };
    spyOn(apiService, 'createReport').and.returnValue(of(mockResponse));

    component.selectedCategory = 'SCHLAGLOCH';
    component.description = 'Test';
    component.submitReport();

    tick();  // Wartet auf alle async Operationen

    // Prüfe nur ob API aufgerufen wurde und Formular zurückgesetzt
    expect(apiService.createReport).toHaveBeenCalled();
    expect(component.selectedCategory).toBeNull();
    expect(component.description).toBe('');
  }));

  // Test 6: ngOnInit lädt Issues
  it('sollte Issues beim Start laden', () => {
    const mockIssues = ['SCHLAGLOCH', 'BEWUCHS'];
    spyOn(apiService, 'getIssue').and.returnValue(of(mockIssues));

    component.ngOnInit();

    expect(apiService.getIssue).toHaveBeenCalled();
  });
});
