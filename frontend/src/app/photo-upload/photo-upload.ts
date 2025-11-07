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
  styleUrl: './photo-upload.css'
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

  onUploadClick(galleryInput: HTMLInputElement): void {
    // Wenn gerade kein Upload läuft
    if (!this.isLoading) {
      this.isLoading = true; // Ladezustand aktivieren

      // Dateiauswahl öffnen
      galleryInput.click();

      // Ladezustand simulieren (später ersetzt durch API)
      setTimeout(() => {
        this.isLoading = false; // Ladezustand beenden
      }, 2000);
    }
  }



  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if(input.files) {
      const files = Array.from(input.files).slice(0, 3);

      //Jede hinzugefügte Datei prüfen
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


      // Warnung anzeigen, falls ungültige Dateien vorhanden sind
      if (this.invalidCount > 0) {
        this.snackBar.open(`${this.invalidCount} Datei(en) ungültig. Es sind nur JPG/PNG Datein und max. 5MB erlaubt.`,
          'OK',
          {duration: 3000}
        );
      }

      // Upload-Button deaktivieren, wenn keine gültigen Dateien da sind
      this.isUploadDisabled = this.validFiles.length === 0;


      this.selectedFiles = files;
      this.photosSelected.emit(this.selectedFiles);

      this.previewUrls = []; // reset previews
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrls.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removePhoto(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
    this.photosSelected.emit(this.selectedFiles);
  }

  private isValidFile(file: File): boolean {
    //Konvertierung des gesamten Strings in Kleinbuchstaben-> Einheitliche Prüfung möglich
    const fileName = file.name.toLowerCase();
    const maxSize = 5 * 1024 * 1024; //Max. 5 MB

    //1. Prüft die Dateiendung
    const hasValidExtension = fileName.endsWith(".jpg") || fileName.endsWith(".png");

    //2. Prüft die Dateigröße
    const hasValidSize = file.size <= maxSize;

    //Beide müssen TRUE sein
    return hasValidExtension && hasValidSize;

  }



}




