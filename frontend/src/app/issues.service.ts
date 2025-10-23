import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { API_BASE_URL } from './env';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class IssuesService {
  constructor(private http: HttpClient) {}
    getIssues(): Observable<string[]> {
      return this.http.get<string[]>(`${API_BASE_URL}/issues`);
  }
}
