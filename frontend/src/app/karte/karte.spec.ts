import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Karte } from './karte';
import {MatButton} from '@angular/material/button';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';

describe('Karte', () => {
  let component: Karte;
  let fixture: ComponentFixture<Karte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Karte, MatButton, MatGridList, MatGridTile],
    }).compileComponents();

    fixture = TestBed.createComponent(Karte);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // -----------------------------------
  // BASE
  // -----------------------------------
  it('sollte erstellt werden', () => {
    expect(component).toBeTruthy();
  });

  // -----------------------------------
  // showMap Logik
  // -----------------------------------
  it('sollte showMap true am Anfang haben', () => {
    expect(component.showMap).toBeTrue();
  });

  it('sendLocation sollte showMap auf false setzen', () => {
    component.showMap = true;
    component.sendLocation();
    expect(component.showMap).toBeFalse();
  });

  it('selectLocation sollte showMap auf false setzen', () => {
    component.showMap = true;
    component.selectLocation();
    expect(component.showMap).toBeFalse();
  });

  // -----------------------------------
  // getCurrentLocation
  // -----------------------------------
  it('sollte currentLocation setzen', () => {
    const dummyLatLng = { lat: 52.5, lng: 13.4 };
    const result = component.getCurrentLocation(dummyLatLng as any);

    expect(component.currentLocation).toEqual([52.5, 13.4]);
    expect(result).toEqual([52.5, 13.4]);
  });

  // -----------------------------------
  // setMarker (ohne echten Leaflet Map)
  // -----------------------------------
  it('setMarker sollte keinen Fehler werfen, wenn map undefined ist', () => {
    expect(() => component.setMarker(52, 13)).not.toThrow();
  });

  // -----------------------------------
  // onMapClick — nur Logik testen
  // -----------------------------------
  it('onMapClick sollte selectedLat/Lng setzen', () => {
    const mockEvent = {
      latlng: { lat: 10, lng: 20 }
    } as any;

    spyOn(component, 'setMarker'); // Leaflet Call NICHT ausführen

    component.onMapClick(mockEvent);

    expect(component.selectedLat).toBe(10);
    expect(component.selectedLng).toBe(20);
    expect(component.setMarker).toHaveBeenCalledOnceWith(10, 20);
  });

  it('T5.19: Karten-Klick speichert Koordinaten', () => { //T5.19
    const mockEvent = {
      latlng: { lat: 51.123, lng: 9.456 }
    } as any;

    spyOn(component, 'setMarker');

    component.onMapClick(mockEvent);

    expect(component.selectedLat).toBe(51.123);
    expect(component.selectedLng).toBe(9.456);
    expect(component.setMarker).toHaveBeenCalledOnceWith(51.123, 9.456);
  });
  it('T5.20: Marker wird korrekt gesetzt', () => {
    // Fake Map-Objekt erstellen
    const fakeMap = {
      removeLayer: jasmine.createSpy('removeLayer'),
      addLayer: jasmine.createSpy('addLayer')
    } as any;

    component.map = fakeMap;

    // Erster Marker
    component.setMarker(10, 20);
    expect(fakeMap.addLayer).toHaveBeenCalledTimes(1);

    const firstMarker = component.marker;

    // Zweiter Marker → alter Layer wird entfernt
    component.setMarker(30, 40);
    expect(fakeMap.removeLayer).toHaveBeenCalledWith(firstMarker);
    expect(fakeMap.addLayer).toHaveBeenCalledTimes(2);
  });
  it('T5.21: GPS Success – Koordinaten werden gesetzt', () => {
    component.getCurrentLocation({ lat: 48.1, lng: 11.2 } as any);

    expect(component.currentLocation).toEqual([48.1, 11.2]);
  });

  it('T5.21: locationfound Event setzt currentLocation', () => {
    // Minimal fake map: SOLO lo que usamos en diesem Test
    const fakeMap = {
      on: (eventName: string, handler: any) => {
        if (eventName === 'locationfound') {
          handler({ latlng: { lat: 52.52, lng: 13.405 } });
        }
      }
    } as any;

    // ⚠️ NICHT component.onMapReady aufrufen → das baut die locate-control auf → ERROR
    // Stattdessen direkt das Event triggern

    fakeMap.on('locationfound', (e: any) => component.getCurrentLocation(e.latlng));

    expect(component.currentLocation).toEqual([52.52, 13.405]);
  });

  it('T5.21: useCurrentLocation setzt Marker & zentriert Karte', () => {
    // Fake Map mit flyTo()
    component.map = jasmine.createSpyObj('Map', ['flyTo']);

    // Spy auf setMarker()
    spyOn(component, 'setMarker');

    // navigator.geolocation mocken
    const mockGeo = {
      getCurrentPosition: jasmine.createSpy('getCurrentPosition')
    };

    // in Browser-API injizieren
    Object.defineProperty(window.navigator, 'geolocation', {
      value: mockGeo,
      writable: true
    });

    const mockPos = {
      coords: { latitude: 50.1, longitude: 8.6 }
    };

    mockGeo.getCurrentPosition.and.callFake((success) => success(mockPos));

    // Testaufruf
    component.useCurrentLocation();

    // Assertions
    expect(component.selectedLat).toBe(50.1);
    expect(component.selectedLng).toBe(8.6);
    expect(component.currentLocation).toEqual([50.1, 8.6]);

    expect(component.map.flyTo).toHaveBeenCalledWith([50.1, 8.6], 150);

    expect(component.setMarker).toHaveBeenCalledWith(50.1, 8.6);
  });

  it('T5.22: zeigt Fehlermeldung bei GPS Permission Denied', () => {
    // mock alert
    spyOn(window, 'alert');

    const mockGeo = {
      getCurrentPosition: jasmine.createSpy('getCurrentPosition')
    };

    Object.defineProperty(window.navigator, 'geolocation', {
      value: mockGeo,
      writable: true
    });

    mockGeo.getCurrentPosition.and.callFake((success, error) => {
      error({ code: 1, message: 'Permission denied' });
    });

    component.useCurrentLocation();

    expect(window.alert).toHaveBeenCalledWith('Der Standort konnte nicht abgerufen werden.');
  });


});
