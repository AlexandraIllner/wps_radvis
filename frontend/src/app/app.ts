import {Component, OnInit, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import {IssuesService} from './issues.service';




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
    HttpClientModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  constructor(private issuesService: IssuesService) {}

  ngOnInit(): void {
    this.issuesService.getIssues().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Mängelkategorien:', err);
      }
    });
  }
  protected readonly title = signal('frontend');

  selectedCategory: string | null = null;

  categories: string[] = [];

  description: string = '';
}
