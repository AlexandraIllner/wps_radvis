/**
 * ===========================================================================
 * ApiService - HTTP Communication Service
 * ============================================================================
**/


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
  })

export class ApiService{
  private readonly baseUrl = environment.apiUrl;  constructor(private http: HttpClient) {}

  //GET-Abfrage: Issue
  getIssue(): Observable<any>{
    return this.http.get(`${this.baseUrl}/api/issues`)
  }

  createReport(data:any): Observable<any>{
    return this.http.post(`${this.baseUrl}/api/report`,data)
  }

}
