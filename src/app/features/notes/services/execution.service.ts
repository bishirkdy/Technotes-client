import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ExecuteCodeRequest, ExecuteCodeResponse } from '../models/execution.model';

@Injectable({ providedIn: 'root' })
export class ExecutionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/executions`;

  execute(request: ExecuteCodeRequest): Observable<ExecuteCodeResponse> {
    return this.http.post<ExecuteCodeResponse>(this.baseUrl, request);
  }
}
