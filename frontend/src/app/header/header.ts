import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    MatCardModule,
    NgOptimizedImage
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

}
