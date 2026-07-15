import fs from 'node:fs';
import path from 'node:path';

const dirs = [
  'src/components/react',
  'src/components/ui',
];

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (ent.name.endsWith('.tsx')) fixFile(p);
  }
}

function fixFile(file) {
  let c = fs.readFileSync(file, 'utf8');
  if (!c.includes('Image') && !c.includes('Link') && !c.includes('dynamic')) return;

  c = c.replace(/<Link\b/g, '<a');
  c = c.replace(/<\/Link>/g, '</a>');
  c = c.replace(/<Image\s+([^>]*)\/>/g, (_, attrs) => {
    const src = attrs.match(/src="([^"]+)"/)?.[1] || attrs.match(/src=\{([^}]+)\}/)?.[1] || '""';
    const alt = attrs.match(/alt="([^"]*)"/)?.[1] || attrs.match(/alt=\{([^}]+)\}/)?.[1] || '""';
    const cls = attrs.match(/className="([^"]*)"/)?.[1] || '';
    const fill = /fill/.test(attrs);
    const w = attrs.match(/width=\{?(\d+)\}?/)?.[1];
    const h = attrs.match(/height=\{?(\d+)\}?/)?.[1];
    const onError = attrs.match(/onError=\{([^}]+)\}/)?.[0] || '';
    if (fill) {
      return `<img src=${src} alt=${alt} className="absolute inset-0 h-full w-full object-cover ${cls}" loading="lazy" ${onError} />`;
    }
    const wh = w && h ? ` width={${w}} height={${h}}` : '';
    return `<img src=${src} alt=${alt}${wh} className="${cls}" loading="lazy" ${onError} />`;
  });

  fs.writeFileSync(file, c);
}

for (const d of dirs) walk(d);
console.log('fixed');
