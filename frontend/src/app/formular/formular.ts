import {Component, OnInit, signal} from '@angular/core';
import {ReactiveFormsModule, FormsModule, FormControl,} from '@angular/forms';
import {ApiService} from '../core/globalService/api.services';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatFormField, MatHint} from '@angular/material/form-field';
import {MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';



@Component({
  selector: 'app-formular',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInput,
    MatHint,
    MatProgressSpinner,
    MatButton,
    MatOption,
  ],
  templateUrl: './formular.html',
  styleUrl: './formular.css'
})
export class Formular implements OnInit {

  category = new FormControl();
  descriptionForm = new FormControl();

  selectedCategory: string | null = null;

  // Kategorien werden aus dem Backend gezogen
  categories: string[] = [];

  description: string = '';

  isLoading = signal(false);

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
      issue: this.selectedCategory ?? 'Keine Kategorie',
      description: (this.description ?? '').trim(),
      latitude: 52.52,
      longitude: 13.405
    };


    this.isLoading.update((isLoading) => !isLoading);

    console.log('Sende diese Daten:', reportData);

    this.apiService.createReport(reportData).subscribe({
      next: response => {
        console.log('Report gesendet', response);
        this.snackBar.open('Danke, dass Sie den Mangel gemeldet haben!', '', {
          duration: 3000,
        });
        this.selectedCategory = null;
        this.description = '';
        this.isLoading.update((isLoading) => !isLoading);
      },
      error: error => {
        this.isLoading.update((isLoading) => !isLoading);
        console.error('Fehler beim Submit', error);
      }
    });
  }


}
