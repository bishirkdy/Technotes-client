export type SqlDialect = 'sqlite' | 'sqlserver' | 'postgresql';

export interface CodeExampleSource {
  code: string;
  language: string;
  dialect?: SqlDialect | null;
  filename?: string | null;
  expectedOutput?: string | null;
  runnable?: boolean;
}

export const RUNNABLE_LANGUAGES = ['html', 'css', 'javascript', 'js', 'csharp', 'bash', 'sql'] as const;
export const PREVIEW_LANGUAGES = ['html', 'css', 'javascript', 'js'] as const;

export const SQL_DIALECTS: ReadonlyArray<{ value: SqlDialect; label: string; runtime: string }> = [
  { value: 'sqlserver', label: 'SQL Server', runtime: 'SQL Server 2022' },
  { value: 'postgresql', label: 'PostgreSQL', runtime: 'PostgreSQL 17' },
  { value: 'sqlite', label: 'SQLite (legacy)', runtime: 'SQLite 3.36' }
];

export function normalizeSqlDialect(dialect: string | null | undefined): SqlDialect {
  const value = (dialect ?? '').trim().toLowerCase();

  switch (value) {
    case 'sqlserver':
    case 'sql-server':
    case 'mssql':
    case 'tsql':
    case 't-sql':
      return 'sqlserver';
    case 'postgres':
    case 'postgresql':
    case 'pgsql':
    case 'psql':
      return 'postgresql';
    default:
      return 'sqlite';
  }
}

export function sqlDialectLabel(dialect: string | null | undefined): string {
  const value = normalizeSqlDialect(dialect);
  return SQL_DIALECTS.find(item => item.value === value)?.label ?? 'SQLite';
}

export function isSqlLanguage(language: string | null | undefined): boolean {
  return normalizeCodeLanguage(language) === 'sql';
}

export function normalizeCodeLanguage(language: string | null | undefined): string {
  const value = (language ?? '').trim().toLowerCase();

  switch (value) {
    case 'cs':
    case 'c#':
    case 'dotnet':
    case '.net':
    case 'ado':
    case 'ado.net':
    case 'ef':
    case 'efcore':
    case 'ef-core':
      return 'csharp';
    case 'js':
      return 'javascript';
    case 'ts':
      return 'typescript';
    case 'sh':
    case 'shell':
      return 'bash';
    case 'htm':
      return 'html';
    case 'text':
    case 'txt':
      return 'plaintext';
    default:
      return value || 'plaintext';
  }
}

export function isRunnableLanguage(language: string | null | undefined): boolean {
  return (RUNNABLE_LANGUAGES as readonly string[]).includes(normalizeCodeLanguage(language));
}

export function isPreviewLanguage(language: string | null | undefined): boolean {
  return (PREVIEW_LANGUAGES as readonly string[]).includes(normalizeCodeLanguage(language));
}

export function codeLanguageLabel(language: string | null | undefined): string {
  const value = normalizeCodeLanguage(language);

  switch (value) {
    case 'csharp':
      return 'C#';
    case 'javascript':
      return 'JavaScript';
    case 'typescript':
      return 'TypeScript';
    case 'jsx':
      return 'JSX';
    case 'html':
      return 'HTML';
    case 'css':
      return 'CSS';
    case 'sql':
      return 'SQL';
    case 'json':
      return 'JSON';
    case 'bash':
      return 'Shell';
    case 'xml':
      return 'XML';
    default:
      return value === 'plaintext' ? 'Code' : value;
  }
}
