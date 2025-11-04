import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera.html',
  styleUrl: './camera.css',
})
export class Camera {
  fileName = '';
  previewData: string | null = null;

  onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const f = input.files?.[0] || null;
    this.fileName = f ? f.name : '';
    if (!f) { this.previewData = null; return; }

    const reader = new FileReader();
    reader.onload = () => this.previewData = reader.result as string;
    reader.readAsDataURL(f);
  }

  removePhoto() {
    this.fileName = '';
    this.previewData = null;
  }
}
