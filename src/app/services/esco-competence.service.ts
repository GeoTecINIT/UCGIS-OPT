import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EscoCompetenceService {
  public allcompetences: any;
  constructor(private http: HttpClient) {
    this.http.get('assets/json/esco.json').subscribe((data) => {
      this.allcompetences = data;
    });
   }
}
