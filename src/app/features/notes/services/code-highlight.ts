import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import csharp from 'highlight.js/lib/languages/csharp';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import plaintext from 'highlight.js/lib/languages/plaintext';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import { normalizeCodeLanguage } from '../models/code-example.model';

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('css', css);
hljs.registerLanguage('javascript', javascript);
hljs.registerAliases(['jsx'], { languageName: 'javascript' });
hljs.registerLanguage('json', json);
hljs.registerLanguage('plaintext', plaintext);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('xml', xml);

export function highlightCode(language: string | null | undefined, code: string): string {
  const value = normalizeCodeLanguage(language);
  const target = value === 'html' ? 'xml' : value;

  if (!hljs.getLanguage(target)) {
    return hljs.highlight(code, { language: 'plaintext' }).value;
  }

  return hljs.highlight(code, { language: target }).value;
}
