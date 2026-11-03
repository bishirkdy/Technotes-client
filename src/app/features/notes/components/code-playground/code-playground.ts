import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  effect,
  output,
  signal
} from '@angular/core';
import { CodeExampleSource, normalizeCodeLanguage } from '../../models/code-example.model';

export interface PlaygroundLog {
  level: 'log' | 'info' | 'warn' | 'error';
  text: string;
}

export interface PlaygroundDocument {
  html: string;
  css: string;
  js: string;
  runId: number;
}

type PlaygroundTab = 'html' | 'css' | 'js';

const HTML_STARTER = '<section class="demo">\n  <h1>Hello, Scribly</h1>\n  <p>Edit this HTML and run it.</p>\n</section>';
const CSS_STARTER = '<section class="demo">\n  <h1>Hello, Scribly</h1>\n  <p>Edit the CSS to change this card.</p>\n</section>';
const JS_STARTER = '<button id="action">Click me</button>\n<p id="output">Ready.</p>';

@Component({
  selector: 'app-code-playground',
  templateUrl: './code-playground.html',
  styleUrl: './code-playground.css'
})
export class CodePlayground implements OnInit, AfterViewInit, OnDestroy {
  @Input({ required: true }) example!: CodeExampleSource;

  readonly closed = output<void>();
  readonly activeTab = signal<PlaygroundTab>('html');
  readonly html = signal('');
  readonly css = signal('');
  readonly js = signal('');
  readonly logs = signal<PlaygroundLog[]>([]);
  readonly documentHtml = signal('');
  readonly copied = signal(false);

  @ViewChild('dialog') private dialogRef?: ElementRef<HTMLDialogElement>;
  @ViewChild('preview') private previewRef?: ElementRef<HTMLIFrameElement>;

  private initialHtml = '';
  private initialCss = '';
  private initialJs = '';
  private runId = 0;
  private copyTimer = 0;

  constructor() {
    effect(() => {
      const html = this.documentHtml();
      const preview = this.previewRef?.nativeElement;
      if (preview) {
        preview.srcdoc = html;
      }
    });
  }

  ngOnInit(): void {
    const language = normalizeCodeLanguage(this.example.language);

    if (language === 'html') {
      this.initialHtml = this.example.code;
      this.activeTab.set('html');
    } else if (language === 'css') {
      this.initialCss = this.example.code;
      this.initialHtml = CSS_STARTER;
      this.activeTab.set('css');
    } else {
      this.initialJs = this.example.code;
      this.initialHtml = JS_STARTER;
      this.activeTab.set('js');
    }

    this.resetFields();
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

  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent): void {
    if (event.source !== this.previewRef?.nativeElement.contentWindow) {
      return;
    }

    const data = event.data as {
      source?: string;
      runId?: number;
      type?: string;
      level?: PlaygroundLog['level'];
      text?: string;
    };

    if (data?.source !== 'scribly-playground' || data.runId !== this.runId || data.type !== 'log') {
      return;
    }

    const level = ['log', 'info', 'warn', 'error'].includes(data.level ?? '')
      ? data.level as PlaygroundLog['level']
      : 'log';

    this.logs.update(items => [...items.slice(-99), { level, text: data.text ?? '' }]);
  }

  setTab(tab: PlaygroundTab): void {
    this.activeTab.set(tab);
  }

  run(): void {
    this.runId += 1;
    this.logs.set([]);
    this.documentHtml.set(buildPlaygroundDocument({
      html: this.html(),
      css: this.css(),
      js: this.js(),
      runId: this.runId
    }));
  }

  reset(): void {
    this.resetFields();
    this.run();
  }

  async copyActive(): Promise<void> {
    const code = this.activeTab() === 'html'
      ? this.html()
      : this.activeTab() === 'css'
        ? this.css()
        : this.js();

    if (!navigator.clipboard?.writeText) {
      return;
    }

    await navigator.clipboard.writeText(code);
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

  tabLabel(tab: PlaygroundTab): string {
    return tab === 'js' ? 'JavaScript' : tab.toUpperCase();
  }

  private resetFields(): void {
    this.html.set(this.initialHtml);
    this.css.set(this.initialCss);
    this.js.set(this.initialJs);
  }
}

function safeScriptJson(value: string): string {
  return JSON.stringify(value ?? '')
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export function buildPlaygroundDocument(source: PlaygroundDocument): string {
  const css = safeScriptJson(source.css);
  const js = safeScriptJson(source.js);
  const runId = JSON.stringify(source.runId);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; base-uri 'none'; connect-src 'none'; font-src data: https:; form-action 'none'; frame-src 'none'; img-src data: https:; media-src data: https:; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline'; worker-src 'none'">
<style>
html { color-scheme: light; }
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; padding: 24px; color: #172033; background: #ffffff; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; line-height: 1.55; }
button, input, select, textarea { font: inherit; }
.demo { max-width: 34rem; padding: 24px; border: 1px solid #dbe3ef; border-radius: 0; background: #f8fafc; }
.demo h1 { margin-top: 0; font-size: 1.55rem; }
</style>
<script>
(() => {
  const style = document.createElement('style');
  style.textContent = ${css};
  document.head.appendChild(style);
})();
</script>
<script>
(() => {
  const source = 'scribly-playground';
  const runId = ${runId};
  const format = (value) => {
    if (typeof value === 'string') return value;
    if (value instanceof Error) return value.stack || (value.name + ': ' + value.message);
    try { return JSON.stringify(value); } catch { return String(value); }
  };
  const send = (level, args) => {
    try {
      parent.postMessage({
        source,
        runId,
        type: 'log',
        level,
        text: args.map(format).join(' ')
      }, '*');
    } catch {}
  };
  ['log', 'info', 'warn', 'error'].forEach((level) => {
    console[level] = (...args) => send(level, args);
  });
  window.addEventListener('error', (event) => {
    send('error', [event.error?.stack || event.message]);
  });
  window.addEventListener('unhandledrejection', (event) => {
    send('error', [event.reason]);
  });
})();
</script>
</head>
<body>
${source.html}
<script>
try {
  (0, eval)(${js});
} catch (error) {
  console.error(error);
}
</script>
</body>
</html>`;
}
