import { TestBed } from '@angular/core/testing';
import { PhotoUpload } from './photo-upload';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('PhotoUpload', () => {
  let component: PhotoUpload;
  let fixture: any;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  // --- Fake File erstellen ---
  function createFakeFile(name: string, sizeBytes: number, type: string): File {
    const blob = new Blob([new Uint8Array(sizeBytes)], { type });
    return new File([blob], name, { type });
  }

  // --- Fake FileList ---
  function createFakeFileList(files: File[]): FileList {
    const data: any = {
      length: files.length,
      item: (i: number) => files[i],
    };
    files.forEach((f, i) => (data[i] = f));
    return data as FileList;
  }

  // --- FileReader Mock für Preview ---
  class FileReaderMock {
    result: string | ArrayBuffer | null = 'data:mock';
    onload: ((ev: any) => void) | null = null;
  }

  beforeEach(async () => {
    snackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [PhotoUpload], // Standalone Component
      providers: [{ provide: MatSnackBar, useValue: snackBarSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoUpload);
    component = fixture.componentInstance;

    // FileReader global ersetzen
    // @ts-ignore
    (window as any).FileReader = FileReaderMock;

    fixture.detectChanges();
  });


  it('übernimmt gültige Dateien, lädt Previews & emit()', () => {
    const f1 = createFakeFile('a.jpg', 1_000_000, 'image/jpeg');
    const f2 = createFakeFile('b.png', 800_000, 'image/png');
    const files = createFakeFileList([f1, f2]);

    const event = { target: { files, value: '' }} as any;

    const emitSpy = jasmine.createSpy('photosSelected');
    component.photosSelected.subscribe(emitSpy);

    component.onFilesSelected(event);

    expect(component.selectedFiles.length).toBe(2);
    expect(component.previewUrls.length).toBe(2);
    expect(component.isLoading).toBeFalse();
    expect(emitSpy).toHaveBeenCalledWith(component.selectedFiles);
  });


  it('warnt bei ungültigen Dateien', () => {
    const ok = createFakeFile('ok.jpg', 1000, 'image/jpeg');
    const wrongType = createFakeFile('bad.gif', 1000, 'image/gif');
    const tooBig = createFakeFile('big.png', 20_000_000, 'image/png'); // > 10MB

    const files = createFakeFileList([ok, wrongType, tooBig]);

    const event = { target: { files, value: '' }} as any;
    component.onFilesSelected(event);

    expect(component.selectedFiles.length).toBe(1);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      '2 Datei(en) ungültig. Erlaubt: JPG/JPEG/PNG, max. 10 MB pro Bild.',
      'OK',
      { duration: 3000 }
    );
  });


  it('beschränkt auf maximal 3 Dateien', () => {
    const f1 = createFakeFile('1.jpg', 1000, 'image/jpeg');
    const f2 = createFakeFile('2.jpg', 1000, 'image/jpeg');
    const f3 = createFakeFile('3.jpg', 1000, 'image/jpeg');
    const f4 = createFakeFile('4.jpg', 1000, 'image/jpeg');

    const files = createFakeFileList([f1, f2, f3, f4]);
    const event = { target: { files, value: '' }} as any;

    component.onFilesSelected(event);

    expect(component.selectedFiles.length).toBe(3);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Maximal 3 Dateien erlaubt. Nur die ersten 3 wurden übernommen.',
      'OK',
      { duration: 3000 }
    );
  });


  it('bricht ab wenn Gesamtgröße > 30MB', () => {
    const f1 = createFakeFile('1.jpg', 12 * 1024 * 1024, 'image/jpeg');
    const f2 = createFakeFile('2.jpg', 12 * 1024 * 1024, 'image/jpeg');
    const f3 = createFakeFile('3.jpg', 12 * 1024 * 1024, 'image/jpeg');

    const files = createFakeFileList([f1, f2, f3]);
    const event = { target: { files, value: 'placeholder' }} as any;

    component.onFilesSelected(event);

    expect(component.selectedFiles.length).toBe(0);
    expect(component.isLoading).toBeFalse();
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Gesamtgröße überschreitet 30 MB. Bitte weniger/kleinere Bilder wählen.',
      'OK',
      { duration: 3500 }
    );
  });


  it('entfernt ein Foto korrekt und emit()', () => {
    const emitSpy = jasmine.createSpy('photosSelected');
    component.photosSelected.subscribe(emitSpy);

    const f1 = createFakeFile('1.jpg', 1000, 'image/jpeg');
    const f2 = createFakeFile('2.jpg', 1000, 'image/jpeg');

    component.selectedFiles = [f1, f2];
    component.previewUrls = ['url1', 'url2'];

    component.removePhoto(0);

    expect(component.selectedFiles.length).toBe(1);
    expect(component.previewUrls.length).toBe(1);
    expect(component.selectedFiles[0].name).toBe('2.jpg');
    expect(emitSpy).toHaveBeenCalledWith(component.selectedFiles);
  });

});
