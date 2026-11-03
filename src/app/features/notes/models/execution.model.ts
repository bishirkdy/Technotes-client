export interface ExecuteCodeRequest {
  language: string;
  code: string;
  dialect?: string | null;
}

export interface ExecutionDiagnostic {
  line: number;
  column: number;
  id: string;
  message: string;
}

export interface ExecuteCodeResponse {
  success: boolean;
  action: 'run' | 'check' | 'preview' | string;
  output: string;
  error: string | null;
  diagnostics: ExecutionDiagnostic[];
  durationMs: number;
  language: string;
  version: string | null;
}
