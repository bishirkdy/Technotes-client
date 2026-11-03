import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  output,
  signal
} from '@angular/core';
import { finalize } from 'rxjs';
import {
  CodeExampleSource,
  codeLanguageLabel,
  isSqlLanguage,
  normalizeCodeLanguage,
  sqlDialectLabel
} from '../../models/code-example.model';
import { ExecuteCodeResponse } from '../../models/execution.model';
import { ExecutionService } from '../../services/execution.service';

@Component({
  selector: 'app-execution-runner',
  templateUrl: './execution-runner.html',
  styleUrl: './execution-runner.css'
})
export class ExecutionRunner implements OnInit, AfterViewInit, OnDestroy {
  @Input({ required: true }) example!: CodeExampleSource;

  readonly closed = output<void>();
  readonly code = signal('');
  readonly result = signal<ExecuteCodeResponse | null>(null);
  readonly running = signal(false);
  readonly copied = signal(false);

  @ViewChild('dialog') private dialogRef?: ElementRef<HTMLDialogElement>;

  private originalCode = '';
  private copyTimer = 0;

  constructor(private readonly execution: ExecutionService) {}

  ngOnInit(): void {
    this.originalCode = this.example.code;
    this.code.set(this.originalCode);
  }

  ngAfterViewInit(): void {
    const dialog = this.dialogRef?.nativeElement;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
    this.run();
  }

  ngOnDestroy(): void {
    window.clearTimeout(this.copyTimer);
    const dialog = this.dialogRef?.nativeElement;
    if (dialog?.open) {
      dialog.close();
    }
  }

  get language(): string {
    return normalizeCodeLanguage(this.example.language);
  }

  get languageLabel(): string {
    return isSqlLanguage(this.example.language)
      ? `SQL · ${sqlDialectLabel(this.example.dialect)}`
      : codeLanguageLabel(this.example.language);
  }

  get statusLabel(): string {
    if (this.running()) {
      return 'Running';
    }

    const result = this.result();
    if (!result) {
      return 'Ready';
    }

    return result.success ? 'Completed' : 'Needs attention';
  }

  get matchesExpected(): boolean | null {
    const expected = this.example.expectedOutput?.trim();
    const actual = this.result()?.output.trim();

    if (!expected || !actual || !this.result()?.success) {
      return null;
    }

    return expected === actual;
  }

  run(): void {
    if (this.running()) {
      return;
    }

    this.running.set(true);
    this.result.set(null);

    this.execution
      .execute({
        language: this.language,
        code: this.code(),
        dialect: this.example.dialect ?? null
      })
      .pipe(finalize(() => this.running.set(false)))
      .subscribe({
        next: result => this.result.set(result),
        error: (error: unknown) => {
          this.result.set({
            success: false,
            action: 'run',
            output: '',
            error: error instanceof Error ? error.message : 'The execution service is unavailable.',
            diagnostics: [],
            durationMs: 0,
            language: this.language,
            version: null
          });
        }
      });
  }

  reset(): void {
    this.code.set(this.originalCode);
    this.run();
  }

  async copyCode(): Promise<void> {
    if (!navigator.clipboard?.writeText) {
      return;
    }

    await navigator.clipboard.writeText(this.code());
    this.copied.set(true);
    window.clearTimeout(this.copyTimer);
    this.copyTimer = window.setTimeout(() => this.copied.set(false), 1800);
  }

  close(): void {
    const dialog = this.dialogRef?.nativeElement;
    if (dialog?.open) {
      dialog.close();
    }
    this.closed.emit();
  }

  onBackdrop(event: MouseEvent): void {
    if (event.target === this.dialogRef?.nativeElement) {
      this.close();
    }
  }
}
