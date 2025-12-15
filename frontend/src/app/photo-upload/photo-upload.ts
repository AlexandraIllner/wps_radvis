import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-photo-upload',
  imports: [MatButton, CommonModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './photo-upload.html',
  styleUrls: ['./photo-upload.css'],
})


/**
 * Komponente zum Hochladen und Verwalten von Fotos.
 *
 * Ermöglicht die Auswahl von bis zu drei Bildern aus der Galerie,
 * prüft Dateityp und -größe und zeigt eine Vorschau der Bilder an.
 *
 * Gültige Bilder werden an die Parent-Komponente weitergegeben.
 */
export class PhotoUpload {

  /** Alle aktuell ausgewählten Dateien */
  selectedFiles: File[] = [];

  /** Base64-URLs zur Anzeige der Bildvorschauen */
  previewUrls: string[] = [];

  /** Zeigt an, ob gerade Dateien geladen/verarbeitet werden */
  isLoading = false;

  /** Liste der gültigen Dateien nach Prüfung */
  validFiles: File[] = [];

  /** Anzahl der ungültigen Dateien */
  invalidCount = 0;

  /** Referenz auf das Datei-Input-Element */
  @ViewChild('galleryInput') galleryInput!: ElementRef<HTMLInputElement>;

  /**
   * Gibt die gültigen, ausgewählten Fotos an die Parent-Komponente weiter.
   */
  @Output() photosSelected = new EventEmitter<File[]>();

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Wird aufgerufen, wenn der Benutzer Dateien auswählt.
   *
   * - Verhindert Duplikate
   * - Prüft Dateityp und Größe
   * - Begrenzt die Anzahl auf maximal 3 Bilder
   * - Erstellt Vorschaubilder
   * - Gibt gültige Dateien per Event an die Parent-Komponente weiter
   *
   * @param event Change-Event des Datei-Inputs
   */
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.isLoading = true;

    //  Neue Dateien holen
    const incoming = Array.from(input.files);

    //  Duplikate vermeiden
    const notAlreadySelected = incoming.filter(
      (newFile) =>
        !this.selectedFiles.some((f) => f.name === newFile.name && f.size === newFile.size),
    );

    //  Einzeldateien prüfen (Endung + 10 MB)
    const newlyValid: File[] = [];
    let newlyInvalidCount = 0;
    for (const file of notAlreadySelected) {
      if (this.isValidFile(file)) {
        newlyValid.push(file);
      } else {
        newlyInvalidCount++;
      }
    }

    if (newlyInvalidCount > 0) {
      this.snackBar.open(
        `${newlyInvalidCount} Datei(en) ungültig. Erlaubt: JPG/JPEG/PNG, max. 10 MB pro Bild.`,
        'OK',
        { duration: 3000 },
      );
    }

    //  Bestehende + neue zusammenführenaber max. 3
    let combined = [...this.selectedFiles, ...newlyValid];
    if (combined.length > 3) {
      this.snackBar.open('Maximal 3 Dateien erlaubt. Nur die ersten 3 wurden übernommen.', 'OK', {
        duration: 3000,
      });
      combined = combined.slice(0, 3);
    }

    //  Gesamtgröße prüfen (30 MB)
    const totalBytes = combined.reduce((sum, f) => sum + f.size, 0);
    const maxTotal = 30 * 1024 * 1024;
    if (totalBytes > maxTotal) {
      this.snackBar.open(
        'Gesamtgröße überschreitet 30 MB. Bitte weniger/kleinere Bilder wählen.',
        'OK',
        { duration: 3500 },
      );
      this.isLoading = false;
      input.value = '';
      return;
    }

    //  Neue Dateien merken
    const actuallyNew = combined.filter(
      (nf) => !this.selectedFiles.some((f) => f.name === nf.name && f.size === nf.size),
    );

    //  Auswahl übernehmen
    this.selectedFiles = combined;
    this.validFiles = combined;
    this.photosSelected.emit(this.selectedFiles);

    //  Previews nur für neue Dateien laden
    let loaded = 0;
    if (actuallyNew.length === 0) {
      this.isLoading = false;
      input.value = '';
      return;
    }

    actuallyNew.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrls.push(reader.result as string);
        loaded++;
        if (loaded === actuallyNew.length) {
          this.isLoading = false;
          input.value = '';
        }
      };
      reader.readAsDataURL(file);
    });
  }

  /** Entfernt ein einzelnes Foto aus der Auswahl */
  removePhoto(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
    this.photosSelected.emit(this.selectedFiles);
  }
  /** Prüft die Dateiendung & -größe */
  private isValidFile(file: File): boolean {
    //Konvertierung des gesamten Strings in Kleinbuchstaben-> Einheitliche Prüfung möglich
    const fileName = file.name.toLowerCase();
    const maxSize = 10 * 1024 * 1024; //Max. 10 MB

    //1. Prüft die Dateiendung
    const hasValidExtension = fileName.endsWith('.jpg') || fileName.endsWith('.png');

    //2. Prüft die Dateigröße
    const hasValidSize = file.size <= maxSize;

    //Beide müssen TRUE sein
    return hasValidExtension && hasValidSize;
  }

  /** Upload Status wird nach erfolgreichem Upload zurückgesetzt */
  resetUploadState(): void {
    this.selectedFiles = [];
    this.previewUrls = [];
    this.validFiles = [];
    this.invalidCount = 0;

    if (this.galleryInput) {
      this.galleryInput.nativeElement.value = '';
    }
  }
}
