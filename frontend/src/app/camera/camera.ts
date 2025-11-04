import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './camera.html',
  styleUrl: './camera.css',
})
export class Camera {
  fileName = '';
  previewData: string | null = null;

  @Output() photoTaken = new EventEmitter<File | null >();


  onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const f = input.files?.[0] || null;
    this.fileName = f ? f.name : '';
    if (!f) { this.previewData = null;
      this.photoTaken.emit(null);
      return; }

    const reader = new FileReader();
    reader.onload = () => this.previewData = reader.result as string;
    reader.readAsDataURL(f);

    this.photoTaken.emit(f);
    input.value = " ";
  }

  removePhoto() {
    this.fileName = '';
    this.previewData = null;
    this.photoTaken.emit(null);
  }
}
