import { Component } from '@angular/core';
import { LeafletDirective } from '@bluehalo/ngx-leaflet';
import L, { Control, latLng, Map, MapOptions, tileLayer } from 'leaflet';
import 'leaflet.locatecontrol';
import { NgxLeafletLocateModule } from '@runette/ngx-leaflet-locate';
import { MatButton } from '@angular/material/button';
import {MatCard} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-karte',
  templateUrl: './karte.html',
  styleUrls: ['./karte.css'],
  imports: [LeafletDirective, NgxLeafletLocateModule, MatButton, MatCard, MatIconModule],
  standalone: true,
})
export class Karte {
  showMap = true;
  isLoadingLocation = false;
  errorMessage: string | null = null;
  osmUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  osmAttrib = 'Map data © <a href="https://osm.org/copyright">OpenStreetMap</a> contributors';
  private lat_long: [number, number] = [48.72720881940671, 9.266967773437502];
  currentLocation: [number, number] | undefined = undefined;

  selectedLat: number | null = null;
  selectedLng: number | null = null;

  marker?: L.CircleMarker;

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

  getCoordinates(): { lat: number; lng: number } | null {
    if (this.selectedLat !== null && this.selectedLng !== null) {
      return { lat: this.selectedLat, lng: this.selectedLng };
    }
    return null;
  }

  onMapReady(map: Map): void {
    this.map = map;

    this.lc = L.control.locate({
      setView: 'always', // or true; recent versions accept 'always'
      keepCurrentZoomLevel: false,
      flyTo: true,
    });

    this.lc.addTo(this.map);

    this.map.on('locationfound', (e) => {
      const latLng = e.latlng;
      console.log('Location found:', latLng.lat, latLng.lng);
      // Call your function with the latLng
      this.getCurrentLocation(latLng);
      console.log(this.currentLocation);
    });

    // Aktiviert Click Event auf Karte
    this.map.on('click', (event: L.LeafletMouseEvent) => this.onMapClick(event));
  }

  setMarker(lat: number, lng: number): void {
    if (!this.map) return;

    // alten Marker entfernen
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // neuen CircleMarker setzen
    this.marker = L.circleMarker([lat, lng], {
      radius: 10,
      color: '#d32f2f',
      weight: 3,
      fillColor: '#f44336',
      fillOpacity: 0.9,
    });

    this.marker.addTo(this.map);
  }

  onMapClick(event: L.LeafletMouseEvent): void {
    this.selectedLat = event.latlng.lat;
    this.selectedLng = event.latlng.lng;

    console.log('Ausgewählte Koordinaten:', {
      lat: this.selectedLat,
      lng: this.selectedLng,
    });

    if (this.selectedLat !== null && this.selectedLng !== null) {
      this.setMarker(this.selectedLat, this.selectedLng);
    }
  }
  sendLocation() {
    this.showMap = false;
    console.log('loc sent!', this.currentLocation);
  }

  selectLocation() {
    this.showMap = false;
    console.log('noch nicht implementiert, sende currentLocation', this.currentLocation);
  }

  useCurrentLocation() {
    if (!navigator.geolocation) {
      this.errorMessage = 'Geolocation wird von diesem Browser nicht unterstützt.';
      return;
    }

    this.errorMessage = null;
    this.isLoadingLocation = true;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        console.log('Standort über Button geholt:', lat, lng);

        // Karte auf Standort setzen
        this.map.flyTo([lat, lng], 150);

        // Marker setzen
        this.setMarker(lat, lng);

        // Werte für später speichern
        this.selectedLat = lat;
        this.selectedLng = lng;
        this.currentLocation = [lat, lng];

        this.isLoadingLocation = false;
      },
      (error) => {
        console.error('Geolocation error:', error);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            this.errorMessage = 'Zugriff auf Standort wurde verweigert.';
            break;
          case error.POSITION_UNAVAILABLE:
            this.errorMessage = 'Standort konnte nicht ermittelt werden.';
            break;
          case error.TIMEOUT:
            this.errorMessage = 'Zeitüberschreitung bei Standort-Ermittlung.';
            break;
          default:
            this.errorMessage = 'Unbekannter Fehler bei der Standort-Ermittlung.';
        }

        this.isLoadingLocation = false;
      },
    );
  }

  hasLocation(): boolean {
    return this.selectedLat !== null && this.selectedLng !== null;
  }

  get formattedLat(): string {
    return this.selectedLat?.toFixed(6) ?? '';
  }

  get formattedLng(): string {
    return this.selectedLng?.toFixed(6) ?? '';
  }


}
