import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Camera } from './camera';

describe('Camera', () => {
  let component: Camera;
  let fixture: ComponentFixture<Camera>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Camera]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Camera);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // überprüft, ob ein Event aufgerufen wurde
  it('soll photoTaken emitten, wenn eine Datei ausgewählt wird', () => {
    spyOn(component.photoTaken, 'emit');

    // Mock file
    const blob = new Blob([''], { type: 'image/png'});
    const file = new File([blob], 'test.png');

    // Mock event
    const event = {
      target: {
        files: [file],
        value: 'path to file'
      }
    } as unknown as Event;

    component.onFileChange(event);

    expect(component.fileName).toBe('test.png');
    expect(component.photoTaken.emit).toHaveBeenCalledWith(file);
  });

  it('soll photoTaken mit null emitten, wenn removePhoto aufgerufen wird', () => {
    spyOn(component.photoTaken, 'emit');

    // Zustand der Komponente setzen
    component.fileName = 'test.png';
    component.previewData = 'data:image...';

    component.removePhoto();

    expect(component.fileName).toBe('');
    expect(component.previewData).toBeNull();
    expect(component.photoTaken.emit).toHaveBeenCalledWith(null);
  });

  it('soll null emitten, wenn Foto-Auswahl abgebrochen wird (keine Datei vorhanden', () => {
    spyOn(component.photoTaken, 'emit');
    // keine files
    const event = { target: { files: []} } as unknown as Event;

    component.onFileChange(event);

    expect(component.photoTaken.emit).toHaveBeenCalledWith(null);
    expect(component.previewData).toBeNull();
  });
});
