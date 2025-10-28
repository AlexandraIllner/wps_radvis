import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { API_BASE_URL } from '../../env';
import {map, Observable} from 'rxjs';
import {IssueLabelDto} from '../models/issue-label.model';

@Injectable({providedIn: 'root'})
export class IssuesService {
  constructor(private http: HttpClient) {}
    getIssues(): Observable<string[]> {
      return this.http.get<string[]>(`${API_BASE_URL}/issues`);
  }

  getIssueLabelsMap(): Observable<Record<string, string>> {
    // Verwende das importierte Model
    return this.http.get<IssueLabelDto[]>(`${API_BASE_URL}/issue-labels`).pipe(
      map(dtos => {
        const labelsMap: Record<string, string> = {};
        for (const dto of dtos) {
          labelsMap[dto.key] = dto.label;
        }
        return labelsMap;
      })
    );
  }
}
