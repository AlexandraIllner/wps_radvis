import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http'; // ist deprecated, sollte ersetzt werden (https://angular.dev/api/common/http/HttpClientModule)
import { ApiService } from '../core/globalService/api.services';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mangel-vorlaeufig',
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    MatSnackBarModule,
  ],
  templateUrl: './mangel-vorlaeufig.html',
  styleUrl: './mangel-vorlaeufig.css'
})
export class MangelVorlaeufig implements OnInit {
  protected readonly title = signal('Mangelmelder'); // hat das eine Funktion im Moment?

  selectedCategory: string | null = null;

  // Kategorien werden aus dem Backend gezogen
  categories: string[] = [];

  description: string = '';

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
   * Sendet die Mangel-Meldung an das Backend
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
        this.snackBar.open('Danke, dass Sie den Mangel gemeldet haben!', '', {
          duration: 3000,
        });
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
