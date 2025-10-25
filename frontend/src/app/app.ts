import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {HttpClientModule} from '@angular/common/http';
import {OnInit} from '@angular/core';
import {environment} from '../enviroments/enviroment';
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
    'Schlagloch',
    'Schlechter Straßenbelag',
    'Bewuchs',
    'Fehlende Beschilderung',
    'Falsche Beschilderung',
    'Poller/Hindernis',
    'Unklare Markierung',
    'Unebenheiten/Bodenwellen'
  ];

  description: string = '';


  constructor(private apiService: ApiService) {

  }

  ngOnInit() {
    // Lädt beim Start der Komponente alle bestehenden Mängel-Meldungen vom Backend
    // GET-Request an /api/issues
    this.apiService.getIssue().subscribe({
      next: response => console.log('Backend antwortet', response),
      error: error => console.log('Fehler beim Laden', error),
    });
  }

  /**
   * Sendet die Mängel-Meldung an das Backend
   * Wird aufgerufen beim Klick auf den "Absenden"-Button
   */
  submitReport() {
    // Sammelt die Formulardaten (Kategorie und Beschreibung)
    const reportData = {
      category: this.selectedCategory,
      description: this.description,
    };

    // Sendet POST-Request mit den Formulardaten an /api/reports
    this.apiService.createReport(reportData).subscribe({
      next: response => console.log('Report erfolgreich gesendet', response),
      error: error => console.log('Fehler beim Senden', error),
    });
  }
}
