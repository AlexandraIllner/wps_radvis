import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {HttpClient,HttpClientModule} from '@angular/common/http';
import {OnInit} from '@angular/core';
import {environment} from '../enviroments/enviroment';

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


  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    this.http.post(`${environment.apiUrl}/api/issue}api/issue`, {}).subscribe({
      next: response => console.log('Backnd antwortet', response),
      error: error => console.log('Fehler beim Laden', error),

    });
  }
}
