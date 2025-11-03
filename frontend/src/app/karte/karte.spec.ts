import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Karte } from './karte';

describe('Karte', () => {
  let component: Karte;
  let fixture: ComponentFixture<Karte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Karte]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Karte);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
