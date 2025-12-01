import {Component, OnInit, signal, ViewChild} from '@angular/core';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
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

/**
 * Komponente für das Mängelmelden-Formular.
 * Verwaltet die Benutzereingaben, Datenuploads und die API-Kommunikation.
 */

export class Formular implements OnInit {

  /** Aktuell ausgewählte Mangel-Kategorie (z.B. "Straßenschaden")*/
  selectedCategory: string | null = null;

  /** Liste aller verfügbaren Kategorien, gelanden vom Backend beim Start */
  categories: string[] = [];

  /** Freitext- Beschreibung des Mangels vom Benutzer */
  description: string = '';

  /** Zeigt an, ob gerade ein API- Request läuft (für Loading-Spinner) */
  isLoading = signal(false);

  /** Array aller hochgeladenen Fotos (aus Upload-Dialog und Kamera */
  selectedFiles: File[] = [];

  /**
   * Referenz zur untergeordneten PhotoUpload-Komponente, um deren Methode aufzurufen (z.B. zum Zurücksetzen).
   **/
  @ViewChild('photoUpload') photoUpload!: PhotoUpload;


  /**
   * Konstruktor der Klasse.
   * Injiziert notwendige Services für Api-Kommunikation und Benachrichtigungen
   * @param apiService- Der Service für Backend-API-Aufrufe.
   * @param snackBar- Der Angular Material Snackbar Service für Benachrichtigungen.
   */
  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {}


  /**
   * Lifecycle-Hook von Angular, aufgerufen nach der Initialisierung der Komponente.
   * Lädt die Kategorien beim Start der Komponente aus dem Backend.
   */
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
   * @param photoUpload
   */
  submitReport(photoUpload: any): void {
    if (!this.selectedCategory && this.description.trim() === '') {
      alert('Bitte wähle eine Kategorie oder gib eine Beschreibung ein!');
      return;
    }

    //  Create Report Object
    const report = {
    issue: this.selectedCategory,
    description: this.description.trim(),
    latitude: 52.52,
    longitude: 13.405
  };
    // send as BLOB
    const formData = new FormData();
    formData.append(
    'report',
    new Blob([JSON.stringify(report)], { type: 'application/json' })
  );

  // send fotos with same name than backend
  this.selectedFiles.forEach((file: File) => {
  formData.append('photos', file, file.name);
  });


    this.isLoading.set(true);
    console.log('Sende FormData ab...');

    this.apiService.createReport(formData).subscribe({
      next: response => {
        this.snackBar.open('Danke, dass Sie den Mangel gemeldet haben!', '', { duration: 3000 });

        // NACH erfolgreichem Senden:
        this.selectedCategory = null;
        this.description = '';
        this.selectedFiles = [];  // ← Fotos zurücksetzen

        this.photoUpload.resetUploadState();

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
   * Wird aufgerufen, wenn ein Foto über die Kamera aufgenommen wird.
   * @param photo - Die aufgenommene Foto-Datei oder null, falls der Vorgang abgebrochen wurde
   */
  onPhotoAdded(photo: File | null): void {
    if (photo) {

      // console.log dient nur zum Testen und kann entfernt werden
      console.log('Kamera-Foto empfangen:', photo.name);
      this.selectedFiles.push(photo);
    } else {
      console.warn('onPhotoAdded aufgerufen, aber kein Foto empfangen.');
    }
  }

  /**
   * Fügt neue Fotos hinzu und verhindert Duplikate (basierend auf Name + Größe).
   * @param files - Ausgewählte Foto-Dateien aus der Upload-Komponente
   */
  onPhotosSelected(files: File[]): void {
    const newOnes = files.filter(
      f => !this.selectedFiles.some(existing => existing.name === f.name && existing.size === f.size)
    );
    this.selectedFiles.push(...newOnes);
  }



  /**
   * Fügt Dateien zur Auswahl hinzu, verhindert Duplikate.
   * @param photoFile - Die aufgenommene Foto-Datei oder `null`, wenn die Aufnahme
   * abgebrochen wurde oder fehlgeschlagen ist
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
