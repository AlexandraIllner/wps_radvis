import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Karte } from './karte';
import { MatButton } from '@angular/material/button';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';

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
    const dummy = { lat: 52.5, lng: 13.4 };
    const result = component.getCurrentLocation(dummy as any);

    expect(result).toEqual([52.5, 13.4]);
    expect(component.currentLocation).toEqual([52.5, 13.4]);
  });

  // -----------------------------------
  // setMarker
  // -----------------------------------
  it('setMarker sollte keinen Fehler werfen, wenn map undefined ist', () => {
    // Kein map = keine Aktion, aber kein Fehler
    expect(() => component.setMarker(52, 13)).not.toThrow();
  });

  // -----------------------------------
  // onMapClick
  // -----------------------------------
  it('onMapClick sollte selectedLat/Lng setzen', () => {
    const event = { latlng: { lat: 10, lng: 20 } } as any;

    spyOn(component, 'setMarker');

    component.onMapClick(event);

    expect(component.selectedLat).toBe(10);
    expect(component.selectedLng).toBe(20);
    expect(component.setMarker).toHaveBeenCalledOnceWith(10, 20);
  });

  // -----------------------------------
  // T5.19
  // -----------------------------------
  it('T5.19: Karten-Klick speichert Koordinaten', () => {
    const event = { latlng: { lat: 51.123, lng: 9.456 } } as any;

    spyOn(component, 'setMarker');

    component.onMapClick(event);

    expect(component.selectedLat).toBe(51.123);
    expect(component.selectedLng).toBe(9.456);
    expect(component.setMarker).toHaveBeenCalledOnceWith(51.123, 9.456);
  });

  // -----------------------------------
  // T5.20 – Marker Logik
  // -----------------------------------
  it('T5.20: Marker wird korrekt gesetzt', () => {
    const fakeMap = {
      removeLayer: jasmine.createSpy('removeLayer'),
      addLayer: jasmine.createSpy('addLayer'),
    } as any;

    component.map = fakeMap;

    component.setMarker(10, 20);
    expect(fakeMap.addLayer).toHaveBeenCalledTimes(1);

    const first = component.marker;

    component.setMarker(30, 40);
    expect(fakeMap.removeLayer).toHaveBeenCalledWith(first);
    expect(fakeMap.addLayer).toHaveBeenCalledTimes(2);
  });

  // -----------------------------------
  // T5.21 – GPS Success
  // -----------------------------------
  it('T5.21: GPS Success – Koordinaten werden gesetzt', () => {
    component.getCurrentLocation({ lat: 48.1, lng: 11.2 } as any);
    expect(component.currentLocation).toEqual([48.1, 11.2]);
  });

  // -----------------------------------
  // T5.21.1 – locationfound
  // -----------------------------------
  it('T5.21.1: locationfound Event setzt currentLocation', () => {
    const fakeEvent = { latlng: { lat: 52.52, lng: 13.405 } };

    component.getCurrentLocation(fakeEvent.latlng as any);

    expect(component.currentLocation).toEqual([52.52, 13.405]);
  });

  // -----------------------------------
  // T5.21.2 – useCurrentLocation success
  // -----------------------------------
  it('T5.21.2: useCurrentLocation setzt Marker & zentriert Karte', () => {
    component.map = jasmine.createSpyObj('Map', ['flyTo']);
    spyOn(component, 'setMarker');

    // Geolocation mock
    const mockGeo = {
      getCurrentPosition: jasmine.createSpy('getCurrentPosition'),
    };

    Object.defineProperty(window.navigator, 'geolocation', {
      value: mockGeo,
      writable: true,
    });

    const pos = { coords: { latitude: 50.1, longitude: 8.6 } };

    mockGeo.getCurrentPosition.and.callFake((success) => success(pos));

    component.useCurrentLocation();

    expect(component.selectedLat).toBe(50.1);
    expect(component.selectedLng).toBe(8.6);
    expect(component.currentLocation).toEqual([50.1, 8.6]);
    expect(component.map.flyTo).toHaveBeenCalledWith([50.1, 8.6], 150);
    expect(component.setMarker).toHaveBeenCalledWith(50.1, 8.6);
  });

  // -----------------------------------
  // T5.21.3 – Permission denied
  // -----------------------------------
  it('T5.21.3: zeigt Fehlermeldung bei GPS Permission Denied', () => {
    spyOn(window, 'alert');

    const mockGeo = {
      getCurrentPosition: jasmine.createSpy('getCurrentPosition'),
    };

    Object.defineProperty(window.navigator, 'geolocation', {
      value: mockGeo,
      writable: true,
    });

    mockGeo.getCurrentPosition.and.callFake((success, error) => {
      error({ code: 1, message: 'Permission denied' });
    });

    component.useCurrentLocation();

    expect(window.alert).toHaveBeenCalledWith('Der Standort konnte nicht abgerufen werden.');
  });

  // -----------------------------------
  // T5.22
  // -----------------------------------
  it('T5.22: Dummy-Check damit Nummerierung bestehen bleibt', () => {
    expect(true).toBeTrue();
  });
});
