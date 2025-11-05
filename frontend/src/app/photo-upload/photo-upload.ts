import {Component, EventEmitter, Output} from '@angular/core';
import {MatButton} from '@angular/material/button';
import { CommonModule } from '@angular/common';


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

  @Output() photosSelected = new EventEmitter<File[]>();


  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files).slice(0, 3);
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
