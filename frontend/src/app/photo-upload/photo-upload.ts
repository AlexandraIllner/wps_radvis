import {Component, EventEmitter, Output} from '@angular/core';
import {MatButton} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";


@Component({
  selector: 'app-photo-upload',
  imports: [
    MatButton,
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './photo-upload.html',
  styleUrls: ['./photo-upload.css']
})


export class PhotoUpload {
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  isLoading = false;
  validFiles: File[] = [];
  invalidCount= 0;
  isUploadDisabled = false;


  @Output() photosSelected = new EventEmitter<File[]>()

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Setzt alle Upload-bezogenen Zustände zurück.
   * Wird nach einem erfolgreichen Upload aufgerufen,
   * damit keine alten Dateien oder Vorschauen sichtbar bleiben.
   */

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if(input.files) {
      this.isLoading= true; // Spinner läuft, wenn die Dateiauswahln startet

      const files = Array.from(input.files).slice(0, 3);
      this.validFiles = [];
      this.invalidCount = 0;
      this.previewUrls = [];


      //Jede hinzugefügte Datei wird geprüft
      for (const file of files) {
        if (this.isValidFile(file)) { // wenn gültig → hinzufügen
          this.validFiles.push(file);
        } else {
          this.invalidCount++  // wenn ungültig → zählen
        }
      }
      // Falls der Nutzer mehr als 3 auswählt → Hinweis anzeigen
      if (input.files.length > 3) {
        this.snackBar.open(
          'Maximal 3 Dateien erlaubt. Nur die ersten 3 wurden übernommen.',
          'OK',
          { duration: 3000 }
        );
      }
      // Gesamtgröße prüfen (max. 30 MB)
      const totalSize = this.validFiles.reduce((sum, f) => sum + f.size, 0);
      const maxTotalSize = 30 * 1024 * 1024; // 30 MB

      // Warnung anzeigen, falls ungültige Dateien vorhanden sind
      if (this.invalidCount > 0) {
        this.snackBar.open(`${this.invalidCount} Datei(en) ungültig. Erlaubt sind JPG/PNG Datein und max. 10MB pro Bild.`,
          'OK',
          {duration: 3000}
        );
      }

      // Upload-Button deaktivieren, wenn keine gültigen Dateien da sind
      this.isUploadDisabled = this.validFiles.length === 0;


      this.photosSelected.emit(this.selectedFiles);
      this.selectedFiles = files;

      // Previews werden geladen
      let loaded = 0;
      this.validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrls.push(reader.result as string);
          loaded++;
          if (loaded === this.validFiles.length) this.isLoading = false; // Spinner AUS, wenn alles geladen
        };
        reader.readAsDataURL(file);
      });

    }
    // Keine gültigen Dateien → Spinner sofort aus
    if (!this.validFiles.length) this.isLoading = false;
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
    const maxSize = 10 * 1024 * 1024; //Max. 5 MB

    //1. Prüft die Dateiendung
    const hasValidExtension = fileName.endsWith(".jpg") || fileName.endsWith(".png");

    //2. Prüft die Dateigröße
    const hasValidSize = file.size <= maxSize;

    //Beide müssen TRUE sein
    return hasValidExtension && hasValidSize;

  }

  /** Upload Status wird nach erfolgreichem Upload zurückgesetzt */
  private resetUploadState(): void {
    this.selectedFiles = [];
    this.previewUrls = [];
    this.validFiles = [];
    this.invalidCount = 0;
  }


}




