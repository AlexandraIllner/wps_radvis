import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Formular } from './formular';

describe('Formular Component', () => {
  let component: Formular;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        Formular,
        HttpClientTestingModule,
      ],
    });

    const fixture = TestBed.createComponent(Formular);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
