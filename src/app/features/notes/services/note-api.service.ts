import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { NoteCreateModel } from '../models/note-create.model';
import { NoteResponse } from '../models/note-response.model';
import { NoteMapperService } from './note-mapper.service';

@Injectable({ providedIn: 'root' })
export class NoteApiService {
  private readonly http = inject(HttpClient);
  private readonly mapper = inject(NoteMapperService);
  private readonly baseUrl = `${environment.apiUrl}/notes`;

  getPublicNotes(): Observable<NoteResponse[]> {
    return this.http.get<NoteResponse[]>(this.baseUrl);
  }

  getById(id: string): Observable<NoteResponse> {
    return this.http.get<NoteResponse>(`${this.baseUrl}/${id}`);
  }

  getMyNotes(): Observable<NoteResponse[]> {
    return this.http.get<NoteResponse[]>(`${this.baseUrl}/my`, { withCredentials: true });
  }

  create(note: NoteCreateModel): Observable<NoteResponse> {
    return this.http.post<NoteResponse>(this.baseUrl, this.mapper.toCreateRequest(note), { withCredentials: true });
  }

  update(id: string, note: NoteCreateModel): Observable<NoteResponse> {
    return this.http.put<NoteResponse>(`${this.baseUrl}/${id}`, this.mapper.toCreateRequest(note), { withCredentials: true });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  search(searchTerm: string): Observable<NoteResponse[]> {
    const params = new HttpParams().set('searchTerm', searchTerm.trim());
    return this.http.get<NoteResponse[]>(`${this.baseUrl}/search`, { params, withCredentials: true });
  }
}
