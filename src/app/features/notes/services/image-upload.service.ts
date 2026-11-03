import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, filter, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ImageUploadResponse } from '../models/image-upload-response.model';

@Injectable({ providedIn: 'root' })
export class ImageUploadService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/images`;

  upload(file: File): Observable<HttpEvent<ImageUploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);

    const request = new HttpRequest('POST', this.endpoint, formData, {
      reportProgress: true
    });

    return this.http.request<ImageUploadResponse>(request);
  }

  uploadResult(file: File): Observable<ImageUploadResponse> {
    return this.upload(file).pipe(
      filter(event => event.type === HttpEventType.Response),
      map(event => event.body as ImageUploadResponse)
    );
  }
}
