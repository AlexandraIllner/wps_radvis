import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangelVorlaeufig } from './mangel-vorlaeufig';

describe('MangelVorlaeufig', () => {
  let component: MangelVorlaeufig;
  let fixture: ComponentFixture<MangelVorlaeufig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MangelVorlaeufig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MangelVorlaeufig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
