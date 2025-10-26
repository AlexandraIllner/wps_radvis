import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {HttpClientModule} from '@angular/common/http';
import {OnInit} from '@angular/core';
import {ApiService} from './core/globalService/api.services';

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

  categories: string[] = [
    'SCHLAGLOCH',
    'SCHLECHTER_STRASSENBELAG',
    'BEWUCHS',
    'FEHLENDE_BESCHILDERUNG',
    'FALSCHE_BESCHILDERUNG',
    'POLLER_HINDERNIS',
    'UNKLARE_MARKIERUNG',
    'UNEBENHEITEN_BODENWELLEN'
  ];

  description: string = '';


  constructor(private apiService: ApiService) {

  }

  ngOnInit() {
    // Lädt beim Start der Komponente alle bestehenden Mängel-Meldungen vom Backend
    // GET-Request an /api/issues
    this.apiService.getIssue().subscribe({
      next: response => console.log('Backend antwortet', response)
    });
  }

  /**
   * Macht Kategorien lesbarer für die Anzeige
   * "SCHLAGLOCH" → "Schlagloch"
   */
  formatCategory(cat: string): string {
    return cat
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());
  }
  /**
   * Sendet die Mängel-Meldung an das Backend
   * Wird aufgerufen beim Klick auf den "Absenden"-Button
   */
  submitReport() {

    if(!this.selectedCategory) {
      alert('Bitte wähle eine Kategorie aus!');
      return;
    }
    // Sammelt die Formulardaten (Kategorie und Beschreibung)
    const reportData = {
      issue: this.selectedCategory,        // "issue" statt "category"!
      description: this.description,
      latitude: 52.52,                     // Berlin Beispiel
      longitude: 13.405                    // Berlin Beispiel
    };


    console.log('Sende diese Daten:', reportData);
    console.log('Als JSON:', JSON.stringify(reportData));

    // Sendet POST-Request mit den Formulardaten an /api/reports
    this.apiService.createReport(reportData).subscribe({
      next: response => {
        console.log('Report gesendet', response);
        // Formular wird zurück´gesetzt
        this.selectedCategory = null;
        this.description = '';
      },
      error: error => {

        console.error('Fehler beim Submit', error);
      }
    });
  }
}
