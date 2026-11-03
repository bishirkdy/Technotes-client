import { buildPlaygroundDocument } from './code-playground';

describe('buildPlaygroundDocument', () => {
  it('builds an isolated document with the configured CSP', () => {
    const document = buildPlaygroundDocument({
      html: '<h1>Hello</h1>',
      css: 'h1 { color: red; }',
      js: 'console.log("ready")',
      runId: 7
    });

    expect(document).toContain("default-src 'none'");
    expect(document).toContain("script-src 'unsafe-inline' 'unsafe-eval'");
    expect(document).toContain('const runId = 7;');
    expect(document).toContain('<h1>Hello</h1>');
  });

  it('escapes script-closing sequences in the editor values', () => {
    const document = buildPlaygroundDocument({
      html: '',
      css: '</style><script>alert("css")</script>',
      js: '</script><script>alert("js")</script>',
      runId: 1
    });

    expect(document).toContain('\\u003c/style>');
    expect(document).toContain('\\u003c/script>');
    expect(document).not.toContain('</script><script>alert("js")</script>');
  });
});
