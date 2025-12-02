import {ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoUpload } from './photo-upload';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

describe('PhotoUpload', () => {
  let component: PhotoUpload;
  let fixture: ComponentFixture<PhotoUpload>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [PhotoUpload, NoopAnimationsModule],
      providers: [
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('soll erstellt werden', () => {
    expect(component).toBeTruthy();
  });

  it('soll gültige Datei erstellen und emitten', () => {
    spyOn(component.photosSelected, 'emit');

    const file = new File([''], 'valid.jpg', { type: 'image/jpeg'});
    const event = { target: {files: [file], value: ''}} as unknown as Event;

    component.onFilesSelected(event);

    expect(component.photosSelected.emit).toHaveBeenCalledWith([file]);
    expect(snackBarSpy.open).not.toHaveBeenCalled();
  });

  it('soll ungültige Dateitypen ablehnen und SnackBar zeigen', () => {
    // Ungültige Endung .txt
    const file = new File([''], 'invalid.txt', { type: 'text/plain' });
    const event = { target: { files: [file], value: '' } } as unknown as Event;

    component.onFilesSelected(event);

    expect(component.selectedFiles.length).toBe(0);
    expect(snackBarSpy.open).toHaveBeenCalled(); // Fehlermeldung erwartet
  });

  it('soll nicht mehr als 3 Dateien erlauben (Slice logic)', () => {
    const mockContent = new Array(1024 * 1024).join('A'); // Simuliert ca. 1MB Daten
    const options = { type: 'image/jpeg' };

    const f1 = new File([mockContent], '1.jpg', options);
    const f2 = new File([mockContent], '2.jpg', options);
    const f3 = new File([mockContent], '3.jpg', options);
    const f4 = new File([mockContent], '4.jpg', options);

    component.selectedFiles = [];

    const event = { target: { files: [f1, f2, f3, f4], value: '' } } as unknown as Event;

    component.onFilesSelected(event);

    const selectedNames = component.selectedFiles.map(f => f.name);

    expect(component.selectedFiles.length).toBe(3);

    expect(selectedNames).toContain(f1.name); // '1.jpg' sollte enthalten sein
    expect(selectedNames).toContain(f2.name); // '2.jpg' sollte enthalten sein
    expect(selectedNames).toContain(f3.name); // '3.jpg' sollte enthalten sein

    // Prüfe den abgeschnittenen Namen
    expect(selectedNames).not.toContain(f4.name); // '4.jpg' sollte NICHT enthalten sein

    // Testet, ob die korrekte Snackbar für das Überschreiten der Maximalanzahl angezeigt wurde.
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      jasmine.stringMatching(/Maximal 3/), // Sucht nach dem korrekten Text
      'OK',
      jasmine.any(Object)
    );
  });

  it('soll Duplikate ignorieren', () => {
    const f1 = new File(['abc'], 'test.jpg');
    component.selectedFiles = [f1]; // Datei ist schon da

    const event = { target: { files: [f1], value: '' } } as unknown as Event;

    component.onFilesSelected(event);

    expect(component.selectedFiles.length).toBe(1); // Keine Verdopplung
  });
});
