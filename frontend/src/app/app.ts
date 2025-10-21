import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {

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
}
