import {Component, OnInit, signal} from '@angular/core';
import {ReactiveFormsModule, FormsModule,} from '@angular/forms';
import {ApiService} from '../core/globalService/api.services';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatFormField, MatHint} from '@angular/material/form-field';
import {MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {PhotoUpload} from '../photo-upload/photo-upload';
import {Camera} from '../camera/camera';

@Component({
  selector: 'app-formular',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInput,
    MatHint,
    MatProgressSpinner,
    MatButton,
    MatOption,
    PhotoUpload,
    Camera,
  ],
  templateUrl: './formular.html',
  styleUrl: './formular.css'
})
export class Formular implements OnInit {

  selectedCategory: string | null = null;

  // Kategorien werden aus dem Backend gezogen
  categories: string[] = [];

  description: string = '';

  isLoading = signal(false);

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    // Lädt Kategorien vom Backend beim Start
    this.apiService.getIssue().subscribe({
      next: response => {
        this.categories = response;
        console.log('Kategorien vom Backend geladen:', this.categories);
      },
      error: error => {
        console.error('Fehler beim Laden der Kategorien:', error);
        // Fallback: Zeige dem User eine Meldung
        alert('Kategorien konnten nicht geladen werden!');
      }
    });
  }

  /**
   * Sendet die Mängel-Meldung an das Backend
   * Wird aufgerufen beim Klick auf den "Absenden"-Button
   */
  submitReport(photoUpload: any): void {
    if (!this.selectedCategory && this.description.trim() === '') {
      alert('Bitte wähle eine Kategorie oder gib eine Beschreibung ein!');
      return;
    }

// FormData anstatt JSON
    const formData = new FormData();
    formData.append('issue', this.selectedCategory ?? '');
    formData.append('description', this.description.trim());
    formData.append('latitude', '52.52');
    formData.append('longitude', '13.405');

    if (photoUpload && photoUpload.validFiles && photoUpload.validFiles.length > 0) {
      photoUpload.validFiles.forEach((file: File) => {
        formData.append('photo', file);
      });
    }

    this.isLoading.set(true);
    console.log('Sende FormData ab...');

    this.apiService.createReport(formData).subscribe({
      next: response => {
        this.snackBar.open('Danke, dass Sie den Mangel gemeldet haben!', '', { duration: 3000 });

        this.selectedCategory = null;
        this.description = '';
        if (photoUpload) photoUpload.resetFiles();

        this.isLoading.set(false);
      },
      error: error => {
        this.isLoading.set(false);
        console.error('Fehler beim Submit', error);
        this.snackBar.open('Fehler beim Senden!', '', { duration: 2500 });
      }
    });
  }

  /**
   * Empfängt das Foto-Event aus der Kamera-Komponente
   * Wird aufgerufen, wenn ein neues Foto aufgenommen wurde
   */
  onPhotoFromCamera(photoFile: File | null): void {
    if (photoFile) {
      console.log('📸 Foto von Kamera empfangen:', photoFile);
      // Später kannst du es direkt an PhotoUpload übergeben oder speichern
    } else {
      console.warn('Kein Foto empfangen.');
    }
  }
}
