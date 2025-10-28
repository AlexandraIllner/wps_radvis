import { Component } from '@angular/core';
import {CdkAccordion, CdkAccordionItem, CdkAccordionModule} from '@angular/cdk/accordion';

@Component({
  selector: 'app-optionen',
  imports: [
    CdkAccordionItem,
    CdkAccordion
  ],
  templateUrl: './optionen.html',
  styleUrl: './optionen.css'
})
export class Optionen {
  items = ['Kategorie wählen', 'Beschreibung', 'Foto', 'Standort'];
  expandedIndex = 0;
}
