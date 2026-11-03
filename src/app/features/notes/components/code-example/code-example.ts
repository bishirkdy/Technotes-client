import { Component, Input, OnChanges, OnDestroy, output, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  CodeExampleSource,
  SqlDialect,
  codeLanguageLabel,
  isPreviewLanguage,
  isRunnableLanguage,
  isSqlLanguage,
  normalizeCodeLanguage,
  sqlDialectLabel
} from '../../models/code-example.model';
import { highlightCode } from '../../services/code-highlight';

@Component({
  selector: 'app-code-example',
  templateUrl: './code-example.html',
  styleUrl: './code-example.css'
})
export class CodeExample implements OnChanges, OnDestroy {
  @Input() code = '';
  @Input() language = 'plaintext';
  @Input() dialect: SqlDialect | null = null;
  @Input() filename: string | null = null;
  @Input() expectedOutput: string | null = null;
  @Input() showLineNumbers = true;
  @Input() wrapCode = false;
  @Input() runnable = true;

  readonly runRequested = output<CodeExampleSource>();
  readonly highlighted = signal<SafeHtml>('');
  readonly lineNumbers = signal<number[]>([]);
  readonly copied = signal(false);

  private copyTimer = 0;

  constructor(private readonly sanitizer: DomSanitizer) {}

  ngOnChanges(): void {
    const html = highlightCode(this.language, this.code ?? '');
    this.highlighted.set(this.sanitizer.bypassSecurityTrustHtml(html));
    this.lineNumbers.set(
      Array.from({ length: Math.max(1, (this.code ?? '').split('\n').length) }, (_, index) => index + 1)
    );
  }

  ngOnDestroy(): void {
    window.clearTimeout(this.copyTimer);
  }

  get languageName(): string {
    return codeLanguageLabel(this.language);
  }

  get title(): string {
    return this.filename?.trim() || this.languageName;
  }

  get dialectName(): string | null {
    return isSqlLanguage(this.language) ? sqlDialectLabel(this.dialect) : null;
  }

  get canRun(): boolean {
    return this.runnable && isRunnableLanguage(this.language);
  }

  get actionLabel(): string {
    return isPreviewLanguage(this.language) ? 'Try it' : 'Run';
  }

  get showNumbers(): boolean {
    return this.showLineNumbers && !this.wrapCode;
  }

  async copy(): Promise<void> {
    if (!navigator.clipboard?.writeText) {
      return;
    }

    await navigator.clipboard.writeText(this.code ?? '');
    this.copied.set(true);
    window.clearTimeout(this.copyTimer);
    this.copyTimer = window.setTimeout(() => this.copied.set(false), 1800);
  }

  run(): void {
    this.runRequested.emit({
      code: this.code ?? '',
      language: normalizeCodeLanguage(this.language),
      dialect: isSqlLanguage(this.language) ? this.dialect : null,
      filename: this.filename,
      expectedOutput: this.expectedOutput,
      runnable: this.runnable
    });
  }
}
