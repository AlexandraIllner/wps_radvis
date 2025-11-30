import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Camera } from './camera';

describe('Camera', () => {
  let component: Camera;
  let fixture: ComponentFixture<Camera>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Camera]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Camera);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // überprüft, ob ein Event aufgerufen wurde
  it('soll photoTaken emitten, wenn eine Datei ausgewählt wird', () => {
    spyOn(component.photoTaken, 'emit');

    // Mock file
    const blob = new Blob([''], { type: 'image/png'});
    const file = new File([blob], 'test.png');

    // Mock event
    const event = {
      target: {
        files: [file],
        value: 'path to file'
      }
    } as unknown as Event;
  });
});
