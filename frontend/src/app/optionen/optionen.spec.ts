import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Optionen } from './optionen';

describe('Optionen', () => {
  let component: Optionen;
  let fixture: ComponentFixture<Optionen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Optionen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Optionen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
