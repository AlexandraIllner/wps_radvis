
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './core/globalService/api.services';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {

  selectedCategory: string | null = null;

  // Kategorien werden aus dem Backend gezogen
  categories: string[] = [];

  description: string = '';

  isLoading = false;

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {
  }

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
   */
  submitReport() {
    if (!this.selectedCategory && this.description.trim() === '') {
      alert('Bitte wähle eine Kategorie oder gib eine Beschreibung ein!');
      return;
    }

    const reportData = {
    issue: this.selectedCategory ?? 'KEINE_KATEGORIE',
    description: (this.description ?? '').trim(),
    latitude: 52.52,
    longitude: 13.405
  };


    this.isLoading = true;

    console.log('Sende diese Daten:', reportData);

    this.apiService.createReport(reportData).subscribe({
      next: response => {
        console.log('Report gesendet', response);
        this.snackBar.open('Danke, dass Sie den Mängel gemeldet haben!', '', {
          duration: 3000,
        });
        this.selectedCategory = null;
        this.description = '';
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        console.error('Fehler beim Submit', error);
      }
    });
  }
}
