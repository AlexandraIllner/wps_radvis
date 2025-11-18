import { Component } from '@angular/core';
import { LeafletDirective } from '@bluehalo/ngx-leaflet';
import { latLng, tileLayer, Map, Control, MapOptions } from 'leaflet';
import 'leaflet.locatecontrol';
import L from 'leaflet';
import { NgxLeafletLocateModule } from '@runette/ngx-leaflet-locate';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-karte',
  templateUrl: './karte.html',
  styleUrls: ['./karte.css'],
  imports: [LeafletDirective, NgxLeafletLocateModule, MatButton],
  standalone: true,
})
export class Karte {
  osmUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  osmAttrib =
    'Map data © <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
  private lat_long: [number, number] = [52.513172, 13.270004];

  map!: Map;
  lc!: Control.Locate;

  osm = tileLayer(this.osmUrl, {
    attribution: this.osmAttrib,
    detectRetina: true,
  });

  options: MapOptions = {
    layers: [this.osm],
    zoom: 8,
    center: latLng(this.lat_long[0], this.lat_long[1]),
  };

  onMapReady(map: Map): void {
    this.map = map;

    this.lc = L.control.locate({
      setView: 'always',        // or true; recent versions accept 'always'
      keepCurrentZoomLevel: false,
      flyTo: true,
      strings: {
        title: 'Show me where I am!',
      },
    });

    this.lc.addTo(this.map);
    this.lc.start();
  }
}
