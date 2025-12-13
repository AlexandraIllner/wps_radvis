import { Component } from '@angular/core';
import { LeafletDirective } from '@bluehalo/ngx-leaflet';
import L, { Control, latLng, Map, MapOptions, tileLayer } from 'leaflet';
import 'leaflet.locatecontrol';
import { NgxLeafletLocateModule } from '@runette/ngx-leaflet-locate';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';



@Component({
  selector: 'app-karte',
  templateUrl: './karte.html',
  styleUrls: ['./karte.css'],
  imports: [LeafletDirective, NgxLeafletLocateModule, MatButton, MatIconModule, MatGridTile, MatGridList],
  standalone: true,
})
/**
 * Karten-Komponente zur Auswahl eines Standorts.
 *
 * Zeigt eine OpenStreetMap-Karte (Leaflet) an, auf der Benutzer:innen
 * entweder ihren aktuellen Standort verwenden oder per Klick
 * einen Punkt auf der Karte auswählen können.
 *
 * Die ausgewählten Koordinaten werden intern gespeichert und können
 * von anderen Komponenten weiterverarbeitet werden.
 */
export class Karte {

  /** Steuert, ob die Karte angezeigt wird */
  showMap = true;

  /** Zeigt an, ob gerade der Standort geladen wird */
  isLoadingLocation = false;

  /** Fehlermeldung bei Problemen mit der Standort-Ermittlung */
  errorMessage: string | null = null;

  /** URL für OpenStreetMap-Kartenkacheln */
  osmUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

  /** Copyright-Hinweis für OpenStreetMap */
  osmAttrib = 'Map data © <a href="https://osm.org/copyright">OpenStreetMap</a> contributors';

  /** Startposition der Karte (Default-Zentrum) */
  private lat_long: [number, number] = [48.72720881940671, 9.266967773437502];

  /** Aktueller Standort des Benutzers (falls vorhanden) */
  currentLocation: [number, number] | undefined = undefined;

  /** Breitengrad des ausgewählten Punktes */
  selectedLat: number | null = null;

  /** Längengrad des ausgewählten Punktes */
  selectedLng: number | null = null;

  /** Aktuell gesetzter Marker auf der Karte */
  marker?: L.CircleMarker;

  /** Leaflet-Map-Instanz */
  map!: Map;

  /** Locate-Control für Standort-Ermittlung */
  lc!: Control.Locate;

  /** OpenStreetMap-Layer */
  osm = tileLayer(this.osmUrl, {
    attribution: this.osmAttrib,
    detectRetina: true,
  });

  /** Konfiguration der Karte (Zoom, Zentrum, Layer) */
  options: MapOptions = {
    layers: [this.osm],
    zoom: 8,
    center: latLng(this.lat_long[0], this.lat_long[1]),
  };

  /**
   * Speichert den aktuellen Standort aus einem Leaflet-Event.
   *
   * @param latLng Standortkoordinaten von Leaflet
   * @returns Aktuelle Koordinaten als Tupel [lat, lng]
   */
  getCurrentLocation(latLng: L.LatLng) {
    this.currentLocation = [latLng.lat, latLng.lng];
    return this.currentLocation;
  }

  /**
   * Gibt die aktuell ausgewählten Koordinaten zurück.
   *
   * @returns Objekt mit lat und lng oder null, falls kein Punkt gewählt wurde
   */
  getCoordinates(): { lat: number; lng: number } | null {
    if (this.selectedLat !== null && this.selectedLng !== null) {
      return { lat: this.selectedLat, lng: this.selectedLng };
    }
    return null;
  }

  /**
   * Wird aufgerufen, sobald die Karte initialisiert ist.
   *
   * - Fügt das Locate-Control hinzu
   * - Reagiert auf Standort-Ermittlung
   * - Aktiviert Klicks auf der Karte
   *
   * @param map Leaflet-Map-Instanz
   */
  onMapReady(map: Map): void {
    this.map = map;

    this.lc = L.control.locate({
      setView: 'always',
      keepCurrentZoomLevel: false,
      flyTo: true,
    });

    this.lc.addTo(this.map);

    this.map.on('locationfound', (e) => {
      const latLng = e.latlng;
      this.getCurrentLocation(latLng);
    });

    // Klick-Event auf der Karte aktivieren
    this.map.on('click', (event: L.LeafletMouseEvent) => this.onMapClick(event));
  }

  /**
   * Setzt einen Marker auf der Karte an der angegebenen Position.
   * Entfernt zuvor gesetzte Marker.
   *
   * @param lat Breitengrad
   * @param lng Längengrad
   */
  setMarker(lat: number, lng: number): void {
    if (!this.map) return;

    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    this.marker = L.circleMarker([lat, lng], {
      radius: 10,
      color: '#d32f2f',
      weight: 3,
      fillColor: '#f44336',
      fillOpacity: 0.9,
    });

    this.marker.addTo(this.map);
  }

  /**
   * Wird ausgelöst, wenn auf die Karte geklickt wird.
   * Speichert die Koordinaten und setzt einen Marker.
   *
   * @param event Klick-Event von Leaflet
   */
  onMapClick(event: L.LeafletMouseEvent): void {
    this.selectedLat = event.latlng.lat;
    this.selectedLng = event.latlng.lng;

    if (this.selectedLat !== null && this.selectedLng !== null) {
      this.setMarker(this.selectedLat, this.selectedLng);
    }
  }

  /**
   * Sendet den aktuell gespeicherten Standort
   * (z. B. beim Bestätigen der Auswahl).
   */
  sendLocation() {
    this.showMap = false;
  }

  /**
   * Platzhalter für alternative Standort-Auswahl.
   * Aktuell noch nicht final implementiert.
   */
  selectLocation() {
    this.showMap = false;
  }

  /**
   * Ermittelt den aktuellen Standort über die Browser-Geolocation.
   * Setzt Marker und zentriert die Karte auf die Position.
   */
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

        this.map.flyTo([lat, lng], 150);
        this.setMarker(lat, lng);

        this.selectedLat = lat;
        this.selectedLng = lng;
        this.currentLocation = [lat, lng];

        this.isLoadingLocation = false;
      },
      (error) => {
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

  /**
   * Prüft, ob ein Standort ausgewählt wurde.
   *
   * @returns true, wenn Koordinaten vorhanden sind
   */
  hasLocation(): boolean {
    return this.selectedLat !== null && this.selectedLng !== null;
  }

  /** Formatierter Breitengrad für die Anzeige */
  get formattedLat(): string {
    return this.selectedLat?.toFixed(6) ?? '';
  }

  /** Formatierter Längengrad für die Anzeige */
  get formattedLng(): string {
    return this.selectedLng?.toFixed(6) ?? '';
  }
}
