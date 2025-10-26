import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './core/globalService/api.services';

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
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('frontend');

  selectedCategory: string | null = null;

  // Kategorien werden aus dem Backend gezogen
  categories: string[] = [];

  description: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    // Lädt Kategorien vom Backend beim Start
    this.apiService.getIssue().subscribe({
      next: response => {
        this.categories = response;  // ⭐ Kategorien aus Backend setzen
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
    if (!this.selectedCategory) {
      alert('Bitte wähle eine Kategorie aus!');
      return;
    }

    // Sammelt die Formulardaten (Kategorie und Beschreibung)
    const reportData = {
      issue: this.selectedCategory,
      description: this.description,
      latitude: 52.52,
      longitude: 13.405
    };

    console.log('Sende diese Daten:', reportData);
    console.log('Als JSON:', JSON.stringify(reportData));

    // Sendet POST-Request mit den Formulardaten an /api/reports
    this.apiService.createReport(reportData).subscribe({
      next: response => {
        console.log('Report gesendet', response);
        // Formular zurücksetzen
        this.selectedCategory = null;
        this.description = '';
      },
      error: error => {
        console.error('Fehler beim Submit', error);
      }
    });
  }
}
