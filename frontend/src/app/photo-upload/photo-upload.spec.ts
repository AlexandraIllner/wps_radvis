import { TestBed } from '@angular/core/testing';
import { PhotoUpload } from './photo-upload';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('PhotoUpload', () => {
  let component: PhotoUpload;

  beforeEach(async () => {
    const snackBarMock = { open: () => {} };

    await TestBed.configureTestingModule({
      imports: [PhotoUpload],
      providers: [
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(PhotoUpload);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
