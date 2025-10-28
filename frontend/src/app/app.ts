import { Component } from '@angular/core';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import { Header} from './header/header';
import {MangelVorlaeufig} from './mangel-vorlaeufig/mangel-vorlaeufig';
import {Optionen} from './optionen/optionen';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CdkAccordionModule,
    Header,
    MangelVorlaeufig,
    Optionen,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {

}

