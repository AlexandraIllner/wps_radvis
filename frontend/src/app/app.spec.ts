import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App Component', () => {
  let component: App;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [App], // Standalone Component
    });

    const fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
