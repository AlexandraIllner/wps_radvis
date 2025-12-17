import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { Report } from '../models/report';

@Injectable({
  providedIn: `root`
})
export class ReportService {
  private readonly url = `/api/reports`;

  constructor(private http: HttpClient) {}

  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(this.url);
  }

}
