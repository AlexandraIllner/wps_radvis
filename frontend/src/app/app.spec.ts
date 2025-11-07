import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { App } from './app';
import { ApiService } from './core/globalService/api.services';

describe('App Component', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let apiService: ApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App, // Standalone Component
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    fixture.detectChanges();
  });

});
