import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-karte',
  templateUrl: './karte.html',
  styleUrls: ['./karte.css'],
  standalone: true,
})
export class Karte implements OnInit {
  map?: L.Map;

  ngOnInit(): void {
    this.map = L.map('map').fitWorld();

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
  }).addTo(this.map);
  }
}
