/**
 * ===========================================================================
 * ApiService - Kommunikation mit dem Backend
 * Zentrale Stelle für alle Backend-Kommunikationen
 * ============================================================================
 **/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';

// Macht den Service überall in der App nutzbar
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Die Backend-URL (z.B. http://localhost:3000)
  private readonly baseUrl = environment.apiUrl;

  // HttpClient für die HTTP-Anfragen
  constructor(private http: HttpClient) {}

  /**
   * Holt alle Meldungen vom Backend
   * GET Request an /api/issues
   */
  getIssue(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/issues`);
  }

  /**
   * Schickt eine neue Meldung ans Backend
   * POST Request an /api/reports
   * data enthält: category und description
   */
  createReport(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/reports`, data);
  }
}
