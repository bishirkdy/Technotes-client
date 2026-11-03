import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scenes } from './note-illustration-scenes.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(projectRoot, 'public', 'illustrations', 'handdrawn', 'v1');
const W = 1600;
const H = 900;

const C = {
  paper: '#f7f0e3',
  paperShade: '#e8dbc6',
  ink: '#37332e',
  muted: '#746a5e',
  blue: '#3f6b86',
  amber: '#b47b2c',
  red: '#a34c3f',
  green: '#537255'
};

const FONT = "'Segoe Print','Bradley Hand','Comic Sans MS',cursive";

const fills = {
  plain: '#f1e7d5',
  blue: '#e1e9ea',
  amber: '#f2e3c6',
  red: '#efdcd7',
  green: '#e4eadc'
};

function makeRng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFrom(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function jitter(rng, amount) {
  return (rng() - 0.5) * amount;
}

function round(value) {
  return Number(value.toFixed(2));
}

function wrap(text, maxChars) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) {
    lines.push(current);
  }
  return lines;
}

function textLine(text, x, y, size, color, anchor = 'middle', extra = '') {
  return `<text x="${round(x)}" y="${round(y)}" text-anchor="${anchor}" font-family="${FONT}" font-size="${size}" fill="${color}" ${extra}>${esc(text)}</text>`;
}

function haloText(text, x, y, size, color, anchor = 'middle', strokeWidth = 9) {
  return `<text x="${round(x)}" y="${round(y)}" text-anchor="${anchor}" font-family="${FONT}" font-size="${size}" fill="${color}" stroke="${C.paper}" stroke-width="${strokeWidth}" stroke-linejoin="round" paint-order="stroke">${esc(text)}</text>`;
}

function roughSegment(x1, y1, x2, y2, rng, options = {}) {
  const color = options.color ?? C.ink;
  const width = options.width ?? 2.2;
  const opacity = options.opacity ?? 0.92;
  const extension = options.extension ?? 0;
  const dash = options.dash ? ` stroke-dasharray="${options.dash}"` : '';
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const sx = x1 - ux * extension;
  const sy = y1 - uy * extension;
  const ex = x2 + ux * extension;
  const ey = y2 + uy * extension;
  const mx = (sx + ex) / 2 + jitter(rng, 4.2);
  const my = (sy + ey) / 2 + jitter(rng, 4.2);
  const startX = sx + jitter(rng, 1.5);
  const startY = sy + jitter(rng, 1.5);
  const endX = ex + jitter(rng, 1.5);
  const endY = ey + jitter(rng, 1.5);
  return `<path d="M ${round(startX)} ${round(startY)} Q ${round(mx)} ${round(my)} ${round(endX)} ${round(endY)}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" opacity="${opacity}"${dash}/>`;
}

function passSegment(x1, y1, x2, y2, rng, options = {}) {
  const width = options.width ?? 2.2;
  const color = options.color ?? C.ink;
  return [
    roughSegment(x1, y1, x2, y2, rng, { ...options, width, opacity: options.opacity ?? 0.9 }),
    roughSegment(x1, y1, x2, y2, rng, { ...options, width: Math.max(1, width * 0.55), opacity: 0.5 })
  ].join('');
}

function roughRect(x, y, w, h, rng, options = {}) {
  const color = options.color ?? C.ink;
  const width = options.width ?? 2.2;
  const extension = options.extension ?? 5;
  return [
    passSegment(x, y, x + w, y, rng, { color, width, extension }),
    passSegment(x + w, y, x + w, y + h, rng, { color, width, extension }),
    passSegment(x + w, y + h, x, y + h, rng, { color, width, extension }),
    passSegment(x, y + h, x, y, rng, { color, width, extension })
  ].join('');
}

function roughQuadratic(p0, control, p1, rng, options = {}) {
  const color = options.color ?? C.ink;
  const width = options.width ?? 2.2;
  const dash = options.dash ? ` stroke-dasharray="${options.dash}"` : '';
  const paths = [];
  for (let pass = 0; pass < 2; pass += 1) {
    const amount = pass === 0 ? 2.5 : 5;
    const sx = p0.x + jitter(rng, amount);
    const sy = p0.y + jitter(rng, amount);
    const cx = control.x + jitter(rng, amount);
    const cy = control.y + jitter(rng, amount);
    const ex = p1.x + jitter(rng, amount);
    const ey = p1.y + jitter(rng, amount);
    paths.push(
      `<path d="M ${round(sx)} ${round(sy)} Q ${round(cx)} ${round(cy)} ${round(ex)} ${round(ey)}" fill="none" stroke="${color}" stroke-width="${pass === 0 ? width : Math.max(1, width * 0.55)}" stroke-linecap="round" opacity="${pass === 0 ? 0.9 : 0.5}"${dash}/>`
    );
  }
  return paths.join('');
}

function roughPolyline(points, rng, options = {}) {
  const paths = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    paths.push(passSegment(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], rng, options));
  }
  return paths.join('');
}

function arrowHead(tip, angle, rng, color = C.ink) {
  const length = 20;
  const spread = 0.52;
  const left = {
    x: tip.x + Math.cos(angle + Math.PI - spread) * length,
    y: tip.y + Math.sin(angle + Math.PI - spread) * length
  };
  const right = {
    x: tip.x + Math.cos(angle + Math.PI + spread) * length,
    y: tip.y + Math.sin(angle + Math.PI + spread) * length
  };
  return [
    passSegment(left.x, left.y, tip.x, tip.y, rng, { color, width: 2.1 }),
    passSegment(right.x, right.y, tip.x, tip.y, rng, { color, width: 2.1 })
  ].join('');
}

function nodeCenter(node) {
  return { x: node.x + node.w / 2, y: node.y + node.h / 2 };
}

function edgePoint(from, to) {
  const a = nodeCenter(from);
  const b = nodeCenter(to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const sx = Math.abs(dx) < 0.001 ? 0.001 : Math.abs(dx);
  const sy = Math.abs(dy) < 0.001 ? 0.001 : Math.abs(dy);
  const scale = Math.min(from.w / 2 / sx, from.h / 2 / sy);
  return { x: a.x + dx * scale, y: a.y + dy * scale };
}

function nodeFill(node) {
  const fill = node.fill ?? fills[node.tone ?? 'plain'];
  const x = node.x;
  const y = node.y;
  const w = node.w;
  const h = node.h;
  if (node.kind === 'diamond') {
    return `<polygon points="${x + w / 2},${y} ${x + w},${y + h / 2} ${x + w / 2},${y + h} ${x},${y + h / 2}" fill="${fill}" opacity="0.96"/>`;
  }
  if (node.kind === 'ellipse') {
    return `<ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${w / 2}" ry="${h / 2}" fill="${fill}" opacity="0.96"/>`;
  }
  if (node.kind === 'cylinder') {
    return `<rect x="${x}" y="${y + 22}" width="${w}" height="${h - 22}" rx="4" fill="${fill}" opacity="0.96"/><ellipse cx="${x + w / 2}" cy="${y + 22}" rx="${w / 2}" ry="22" fill="${fill}" opacity="0.96"/>`;
  }
  if (node.kind === 'note') {
    const fold = 34;
    return `<path d="M ${x} ${y} H ${x + w - fold} L ${x + w} ${y + fold} V ${y + h} H ${x} Z" fill="${fill}" opacity="0.96"/>`;
  }
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${node.kind === 'round' ? 24 : 8}" fill="${fill}" opacity="0.96"/>`;
}

function nodeStroke(node, rng) {
  const x = node.x;
  const y = node.y;
  const w = node.w;
  const h = node.h;
  const color = node.stroke ?? C.ink;
  if (node.kind === 'diamond') {
    return [
      passSegment(x + w / 2, y, x + w, y + h / 2, rng, { color }),
      passSegment(x + w, y + h / 2, x + w / 2, y + h, rng, { color }),
      passSegment(x + w / 2, y + h, x, y + h / 2, rng, { color }),
      passSegment(x, y + h / 2, x + w / 2, y, rng, { color })
    ].join('');
  }
  if (node.kind === 'ellipse') {
    return [
      `<ellipse cx="${x + w / 2 + jitter(rng, 1.5)}" cy="${y + h / 2 + jitter(rng, 1.5)}" rx="${w / 2 + jitter(rng, 2)}" ry="${h / 2 + jitter(rng, 2)}" fill="none" stroke="${color}" stroke-width="2.1" opacity="0.9" transform="rotate(${round(jitter(rng, 1.6))} ${x + w / 2} ${y + h / 2})"/>`,
      `<ellipse cx="${x + w / 2 + jitter(rng, 1.5)}" cy="${y + h / 2 + jitter(rng, 1.5)}" rx="${w / 2 + jitter(rng, 2)}" ry="${h / 2 + jitter(rng, 2)}" fill="none" stroke="${color}" stroke-width="1.1" opacity="0.42" transform="rotate(${round(jitter(rng, 1.6))} ${x + w / 2} ${y + h / 2})"/>`
    ].join('');
  }
  if (node.kind === 'cylinder') {
    return [
      `<ellipse cx="${x + w / 2}" cy="${y + 22}" rx="${w / 2}" ry="22" fill="none" stroke="${color}" stroke-width="2.1" opacity="0.9"/>`,
      passSegment(x, y + 22, x, y + h, rng, { color }),
      passSegment(x + w, y + 22, x + w, y + h, rng, { color }),
      `<path d="M ${x} ${y + h - 3} Q ${x + w / 2} ${y + h + 25} ${x + w} ${y + h - 3}" fill="none" stroke="${color}" stroke-width="2.1" opacity="0.9"/>`
    ].join('');
  }
  if (node.kind === 'note') {
    const fold = 34;
    return [
      roughRect(x, y, w, h, rng, { color }),
      passSegment(x + w - fold, y, x + w - fold + 5, y + fold - 5, rng, { color, width: 1.6 }),
      passSegment(x + w - fold + 5, y + fold - 5, x + w, y + fold, rng, { color, width: 1.6 }),
      passSegment(x + w - fold, y, x + w - fold, y + fold, rng, { color, width: 1.6 }),
      passSegment(x + w - fold, y + fold, x + w, y + fold, rng, { color, width: 1.6 })
    ].join('');
  }
  return roughRect(x, y, w, h, rng, { color });
}

function nodeLabel(node) {
  let size = node.size ?? (node.kind === 'diamond' ? 20 : 24);
  const subSize = node.subSize ?? 17;
  const available = node.w - 32;
  const longestWord = Math.max(...String(node.label).split(/\s+/).map(word => word.length));
  if (longestWord * size * 0.58 > available) {
    size = Math.max(15, Math.floor(available / (longestWord * 0.58)));
  }
  const maxChars = Math.max(7, Math.floor(available / (size * 0.56)));
  const lines = wrap(node.label, maxChars);
  const subMax = Math.max(8, Math.floor(available / (subSize * 0.54)));
  const subLines = node.sub ? wrap(node.sub, subMax) : [];
  const lineHeight = size * 1.16;
  const subLineHeight = subSize * 1.24;
  const total = lines.length * lineHeight + (subLines.length ? subLines.length * subLineHeight + 7 : 0);
  let y = node.y + node.h / 2 - total / 2 + size * 0.82;
  const output = [];
  for (const line of lines) {
    output.push(textLine(line, node.x + node.w / 2, y, size, node.textColor ?? C.ink));
    y += lineHeight;
  }
  if (subLines.length) {
    y += 7 - lineHeight + subLineHeight;
    for (const line of subLines) {
      output.push(textLine(line, node.x + node.w / 2, y, subSize, node.subColor ?? C.muted));
      y += subLineHeight;
    }
  }
  return output.join('');
}

function drawArrow(arrow, nodes, rng) {
  const color = arrow.color ?? C.ink;
  const dash = arrow.dashed ? '11 9' : undefined;
  let start;
  let end;
  let control;
  let points;

  if (arrow.points) {
    points = arrow.points;
    start = { x: points[0][0], y: points[0][1] };
    end = { x: points[points.length - 1][0], y: points[points.length - 1][1] };
  } else {
    const from = nodes.get(arrow.from);
    const to = nodes.get(arrow.to);
    if (!from || !to) {
      return '';
    }
    start = edgePoint(from, to);
    end = edgePoint(to, from);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy) || 1;
    const bend = arrow.bend ?? 0;
    control = {
      x: (start.x + end.x) / 2 + (-dy / length) * bend,
      y: (start.y + end.y) / 2 + (dx / length) * bend
    };
  }

  let path;
  let tip;
  let angle;
  if (points) {
    path = roughPolyline(points, rng, { color, width: arrow.width ?? 2.2, dash });
    tip = end;
    angle = Math.atan2(end.y - points[points.length - 2][1], end.x - points[points.length - 2][0]);
  } else {
    path = roughQuadratic(start, control, end, rng, { color, width: arrow.width ?? 2.2, dash });
    tip = end;
    angle = Math.atan2(end.y - control.y, end.x - control.x);
  }

  const output = [path, arrowHead(tip, angle, rng, color)];
  const gap = Math.hypot(end.x - start.x, end.y - start.y);
  const suppressLabel = arrow.label && !arrow.labelAt && !arrow.keepLabel
    && Math.abs(end.y - start.y) < 48 && gap < 290;
  if (arrow.label && !suppressLabel) {
    let labelX;
    let labelY;
    if (arrow.labelAt) {
      labelX = arrow.labelAt[0];
      labelY = arrow.labelAt[1];
    } else if (points) {
      const index = Math.max(0, Math.floor((points.length - 1) / 2));
      labelX = (points[index][0] + points[Math.min(points.length - 1, index + 1)][0]) / 2;
      labelY = (points[index][1] + points[Math.min(points.length - 1, index + 1)][1]) / 2 - 10;
    } else {
      labelX = 0.25 * start.x + 0.5 * control.x + 0.25 * end.x;
      labelY = 0.25 * start.y + 0.5 * control.y + 0.25 * end.y - 10;
    }
    output.push(haloText(arrow.label, labelX, labelY, 18, color));
  }
  return output.join('');
}

function drawNote(note) {
  return haloText(note.text, note.x, note.y, note.size ?? 20, note.color ?? C.muted, note.anchor ?? 'middle', 8);
}

function drawAsterisk(x, y, rng) {
  return [
    passSegment(x - 15, y, x + 15, y, rng, { color: C.amber, width: 1.8 }),
    passSegment(x, y - 15, x, y + 15, rng, { color: C.amber, width: 1.8 }),
    passSegment(x - 10, y - 10, x + 10, y + 10, rng, { color: C.amber, width: 1.8 }),
    passSegment(x + 10, y - 10, x - 10, y + 10, rng, { color: C.amber, width: 1.8 })
  ].join('');
}

function renderScene(scene) {
  const rng = makeRng(seedFrom(scene.file));
  const nodes = new Map(scene.nodes.map(node => [node.id, node]));
  const titleSize = scene.titleSize ?? 41;
  const title = scene.title;
  const underlineLength = Math.min(760, Math.max(280, title.length * titleSize * 0.48));

  const body = [];
  body.push(`<rect width="${W}" height="${H}" fill="${C.paper}"/>`);
  body.push(`<rect width="${W}" height="${H}" fill="#000" filter="url(#paperNoise)" opacity="0.13"/>`);
  body.push(roughRect(30, 30, W - 60, H - 60, rng, { color: C.paperShade, width: 1.4, extension: 2 }));
  body.push(textLine(title, 76, 78, titleSize, C.ink, 'start', 'font-weight="600"'));
  body.push(textLine(scene.subtitle, 78, 119, 20, C.muted, 'start'));
  body.push(passSegment(78, 94, 78 + underlineLength, 94, rng, { color: C.amber, width: 4, extension: 2 }));
  body.push(drawAsterisk(1487, 66, rng));

  for (const node of scene.nodes) {
    body.push(nodeFill(node));
  }

  for (const arrow of scene.arrows ?? []) {
    body.push(drawArrow(arrow, nodes, rng));
  }

  for (const node of scene.nodes) {
    body.push(nodeStroke(node, rng));
    body.push(nodeLabel(node));
  }

  for (const note of scene.notes ?? []) {
    body.push(drawNote(note));
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(scene.alt ?? title)}">
<defs>
<filter id="paperNoise" x="0" y="0" width="100%" height="100%">
<feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="2" seed="${seedFrom(scene.file) % 97}" stitchTiles="stitch"/>
<feColorMatrix type="saturate" values="0"/>
<feComponentTransfer><feFuncA type="table" tableValues="0 0.18"/></feComponentTransfer>
</filter>
</defs>
${body.join('\n')}
</svg>
`;
}

await mkdir(outputDir, { recursive: true });
for (const scene of scenes) {
  const filePath = path.join(outputDir, `${scene.file}.svg`);
  await writeFile(filePath, renderScene(scene), 'utf8');
}
console.log(`Generated ${scenes.length} illustrations in ${outputDir}`);
