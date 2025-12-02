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
});
