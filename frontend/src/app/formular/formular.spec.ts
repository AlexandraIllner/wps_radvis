import {TestBed} from '@angular/core/testing';
import {Formular} from './formular';

describe('Formular Component', () => {
  let component: Formular;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Formular], // Standalone Component
    });

    const fixture = TestBed.createComponent(Formular);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
