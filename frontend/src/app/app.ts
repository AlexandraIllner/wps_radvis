import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http'; // deprecated, drunter aktueller Client - aber wo wird's genutzt?
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Formular } from './formular/formular';
import { Header } from './header/header';
import { Karte } from './karte/karte';
import { Camera } from './camera/camera';
import { PhotoUpload } from './photo-upload/photo-upload';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    Formular,
    Header,
    Karte,

  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  photoFile: File | null = null;

  onPhotoFromCamera(file: File | null) {
    this.photoFile = file;
    console.log('Foto im Parent empfangen:', file);
  }
}
