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

    expect(component.photosSelected.length).toBe(1);
    expect(component.photosSelected.emit).toHaveBeenCalledWith([file]);
    expect(snackBarSpy.open).not.toHaveBeenCalled();
  })
});
