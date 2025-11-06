import {Component, EventEmitter, Output} from '@angular/core';
import {MatButton} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-photo-upload',
  imports: [
    MatButton,
    CommonModule
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


  constructor(private snackBar: MatSnackBar) {

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


  @Output() photosSelected = new EventEmitter<File[]>()


  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files).slice(0, 3);

      //Jede hinzugefügte Datei prüfen
      for (const file of files) {
        if(this.isValidFile(file)) { // wenn gültig → hinzufügen
          this.validFiles.push(file);
        }else{
          this.invalidCount++  // wenn ungültig → zählen
        }
      }
      // Warnung anzeigen, falls ungültige Dateien vorhanden sind
      if(this.invalidCount>0){
        this.snackBar.open(`${this.invalidCount} Datei(en) ungültig. Es sind nur JPG/PNG Datein und max. 5MB erlaubt.`,
          'OK',
          {duration: 3000}
        );
        }

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


}



