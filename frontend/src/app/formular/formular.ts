import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../core/globalService/api.services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormField, MatHint } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { PhotoUpload } from '../photo-upload/photo-upload';
import { Camera } from '../camera/camera';
import { Karte } from '../karte/karte';
import { CommonModule } from '@angular/common';

/**
 * Komponente für das Mängelmelden-Formular.
 * Verwaltet die Benutzereingaben, Datenuploads und die API-Kommunikation.
 */

@Component({
  selector: 'app-formular',
  imports: [
    CommonModule,
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
  styleUrl: './formular.css',
})
export class Formular implements OnInit {

  /** Die aktuell ausgewählte Kategorie (z. B. „Straßenschaden“) */
  selectedCategory: string | null = null;

  /** Kategorien vom Backend, werden beim Laden des Formulars gefüllt */
  categories: string[] = [];

  /** Beschreibung des Mangels, die der Nutzer eingibt */
  description: string = '';

  /** Flag für den Ladezustand – true während einer API-Anfrage */
  isLoading = signal(false);

  /** Alle ausgewählten bzw. aufgenommenen Bilder */
  selectedFiles: File[] = [];


  /**
   * Referenz zur untergeordneten PhotoUpload-Komponente, um deren Methode aufzurufen (z.B. zum Zurücksetzen).
   **/
  @ViewChild('photoUpload') photoUpload!: PhotoUpload;


  /**
   * Konstruktor der Klasse.
   * Hier werden die Services reingeholt, die wir in der Komponente brauchen.
   * Der ApiService kümmert sich um die Kommunikation mit dem Backend
   * und der MatSnackBar zeigt kleine Hinweise/Fehlermeldungen im UI an.
   *
   * @param apiService - Service für Requests an das Backend
   * @param snackBar - Angular Material SnackBar für kurze Benachrichtigungen
   */
  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {}


  /**
   * Lifecycle-Hook von Angular, aufgerufen nach der Initialisierung der Komponente.
   * Lädt die Kategorien beim Start der Komponente aus dem Backend.
   */
  ngOnInit() {
    // Lädt Kategorien vom Backend beim Start
    this.apiService.getIssue().subscribe({
      next: (response) => {
        this.categories = response;
        console.log('Kategorien vom Backend geladen:', this.categories);
      },
      error: (error) => {
        console.error('Fehler beim Laden der Kategorien:', error);
        // Fallback: Zeige dem User eine Meldung
        alert('Kategorien konnten nicht geladen werden!');
      },
    });
  }

  /**
  * Sendet die komplette Mängel-Meldung (Kategorie, Beschreibung, Fotos, Standort)
  * an das Backend. Wird per Klick auf den "Absenden"-Button ausgelöst.
  *
  * Dabei wird ein FormData-Objekt gebaut, das den Report als JSON
  * und alle ausgewählten Fotos enthält.
   * @param photoUpload - Referenz zur PhotoUpload-Komponente, um nach dem Senden den Upload-Zustand zurückzusetzen
  */
  @ViewChild(Karte) karte!: Karte;

  /**
   * Sendet die Mängel-Meldung an das Backend
   * Wird aufgerufen beim Klick auf den "Absenden"-Button
   * @param photoUpload
   */
  submitReport(photoUpload?: any): void {
    const coords = this.karte.getCoordinates();

    if (!this.selectedCategory && this.description.trim() === '') {
      alert('Bitte wähle eine Kategorie oder gib eine Beschreibung ein!');
      return;
    }

    //  Erzeugt den Report-Objekt mit allen Daten des Formulares
    const report = {
      issue: this.selectedCategory,
      description: this.description.trim(),
      latitude: coords?.lat ?? null,
      longitude: coords?.lng ?? null
  };
    // Verpackt den Report als JSON-BLOB
    const formData = new FormData();
    formData.append(
    'report',
    new Blob([JSON.stringify(report)], { type: 'application/json' })
  );

  // Fügt alle ausgewählten Fotos hinzu (Name wie im Originalfile)
  this.selectedFiles.forEach((file: File) => {
  formData.append('photos', file, file.name);
  });

    // send fotos with same name than backend
    this.selectedFiles.forEach((file: File) => {
      formData.append('photos', file, file.name);
    });

    this.isLoading.set(true);
    console.log('Sende FormData ab...');

    this.apiService.createReport(formData).subscribe({
      next: (response) => {
        this.snackBar.open('Danke, dass Sie den Mangel gemeldet haben!', '', { duration: 3000 });

        // NACH erfolgreichem Senden:
        this.selectedCategory = null;
        this.description = '';
        this.selectedFiles = []; // ← Fotos zurücksetzen

        this.photoUpload.resetUploadState();

        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Fehler beim Submit', error);
        this.snackBar.open('Fehler beim Senden!', '', { duration: 2500 });
      },
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
   * Wird aufgerufen, wenn neue Fotos aus der Upload-Komponente kommen.
   * Entfernt Duplikate und fügt nur wirklich neue Dateien hinzu.
   *
   * @param files Die ausgewählten Dateien, die von der Upload-Komponente geliefert werden.
   */
  onPhotosSelected(files: File[]): void {
    const uniqueIncoming = files.filter(
      (file, index, self) =>
        index === self.findIndex((f) => f.name === file.name && f.size === file.size),
    );

    const newOnes = uniqueIncoming.filter(
      (f) =>
        !this.selectedFiles.some(
          (existing) => existing.name === f.name && existing.size === f.size,
        ),
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
