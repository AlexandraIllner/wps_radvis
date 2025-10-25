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

    //GET: Daten fetchen beim Start
    this.apiService.getIssue().subscribe({
      next: response => console.log('Backend antwortet', response),
      error: error => console.log('Fehler beim Laden', error),

    });
  }
    //POST: Mängel melden
    submitReport()
    {
      //POST zum Backend
      const reportData = {
        category: this.selectedCategory,
        description: this.description,
      };

      this.apiService.createReport({reportData}).subscribe({
        next: response => console.log('Backend antwortet', response),
        error: error => console.log('Fehler beim Laden', error),
      });
    }
  }


