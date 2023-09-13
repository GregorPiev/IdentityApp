import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayService {

  constructor(private http: HttpClient) { }

  getPlayers(): Observable<unknown> {
    return this.http.get<unknown>(`${environment.appUrl}/api/play/get-players`);
  }
}
