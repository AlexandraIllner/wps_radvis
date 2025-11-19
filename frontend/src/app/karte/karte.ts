import { Component } from '@angular/core';
import { LeafletDirective } from '@bluehalo/ngx-leaflet';
import L, { Control, latLng, Map, MapOptions, tileLayer } from 'leaflet';
import 'leaflet.locatecontrol';
import { NgxLeafletLocateModule } from '@runette/ngx-leaflet-locate';
import { MatButton } from '@angular/material/button';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';

@Component({
  selector: 'app-karte',
  templateUrl: './karte.html',
  styleUrls: ['./karte.css'],
  imports: [LeafletDirective, NgxLeafletLocateModule, MatButton, MatGridList, MatGridTile],
  standalone: true,
})
export class Karte {
  showMap = true;
  osmUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  osmAttrib = 'Map data © <a href="https://osm.org/copyright">OpenStreetMap</a> contributors';
  private lat_long: [number, number] = [48.72720881940671, 9.266967773437502];
  currentLocation: [number, number] | undefined = undefined;
  getCurrentLocation(latLng: L.LatLng) {
    this.currentLocation = [latLng.lat, latLng.lng];
    return this.currentLocation;
  }

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
      setView: 'always', // or true; recent versions accept 'always'
      keepCurrentZoomLevel: false,
      flyTo: true,
    });

    this.lc.addTo(this.map);
    this.lc.start();

    this.map.on('locationfound', (e) => {
      const latLng = e.latlng;
      console.log('Location found:', latLng.lat, latLng.lng);
      // Call your function with the latLng
      this.getCurrentLocation(latLng);
      console.log(this.currentLocation);
    });
  }

  sendLocation() {
    this.showMap = false;
    console.log('loc sent!', this.currentLocation);
  }

  selectLocation() {
    this.showMap = false;
    console.log('noch nicht implementiert, sende currentLocation', this.currentLocation);
  }
}
