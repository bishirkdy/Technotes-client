import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { NoteCreateModel } from '../models/note-create.model';
import { NoteResponse } from '../models/note-response.model';

@Injectable({
  providedIn: 'root'
})
export class NoteApiService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiUrl}/notes`;


  // Get all public notes
  getPublicNotes(): Observable<NoteResponse[]> {
    return this.http.get<NoteResponse[]>(this.baseUrl);
  }


  // Get one note by ID
  getById(id: string): Observable<NoteResponse> {

    return this.http.get<NoteResponse>(
      `${this.baseUrl}/${id}`
    );
  }


  // Get current user's notes
  getMyNotes(): Observable<NoteResponse[]> {

    return this.http.get<NoteResponse[]>(
      `${this.baseUrl}/my`
    );
  }


  // Create a new note
  create(
    request: NoteCreateModel
  ): Observable<NoteResponse> {

    return this.http.post<NoteResponse>(
      this.baseUrl,
      request
    );
  }


  // Update an existing note
  update(
    id: string,
    request: NoteCreateModel
  ): Observable<NoteResponse> {

    return this.http.put<NoteResponse>(
      `${this.baseUrl}/${id}`,
      request
    );
  }


  // Delete a note
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }


  // Search current user's notes
  search(searchTerm: string): Observable<NoteResponse[]> {
    return this.http.get<NoteResponse[]>(
      `${this.baseUrl}/search`,
      {
        params: {searchTerm}
      }
    );
  }
}