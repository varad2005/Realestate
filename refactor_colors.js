import fs from 'fs';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src');

const replacements = [
  // Remaining branding mapping
  { regex: /\b(text|bg|border|ring|stroke|fill)-(purple|violet|fuchsia|cyan|teal)-[4-7]00\b/g, replace: '$1-accent' },
  { regex: /\b(text|bg|border|ring)-(purple|violet|fuchsia|cyan|teal)-50\b/g, replace: '$1-accent/10' },

  // Semantic mappings
  { regex: /\b(text|bg|border|ring)-(red|rose)-[5-7]00\b/g, replace: '$1-destructive' },
  { regex: /\b(text|bg|border|ring)-(red|rose)-[5]0\b/g, replace: '$1-destructive/10' },
  
  { regex: /\b(text|bg|border|ring)-(green|emerald)-[5-7]00\b/g, replace: '$1-success' },
  { regex: /\b(text|bg|border|ring)-(green|emerald)-[5]0\b/g, replace: '$1-success/10' },
  { regex: /\b(text|bg|border|ring)-(green|emerald)-100\b/g, replace: '$1-success/20' },
  { regex: /\b(text|bg|border|ring)-(green|emerald)-800\b/g, replace: '$1-success' },
  
  { regex: /\b(text|bg|border|ring)-(yellow|amber|orange)-[4-6]00\b/g, replace: '$1-warning' },
  { regex: /\b(text|bg|border|ring)-(yellow|amber|orange)-[5]0\b/g, replace: '$1-warning/10' },

  // Catchall remaining blue/indigo as info or secondary
  { regex: /\b(text|bg|border|ring)-(blue|indigo|sky)-[5-7]00\b/g, replace: '$1-secondary' },
  { regex: /\b(text|bg|border|ring)-(blue|indigo|sky)-[5]0\b/g, replace: '$1-secondary/10' },
  { regex: /\b(text|bg|border|ring)-(blue|indigo|sky)-100\b/g, replace: '$1-secondary/20' },

  // Catchall pink
  { regex: /\b(text|bg|border|ring)-pink-[0-9]{2,3}\b/g, replace: '$1-primary' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf-8');
      let originalContent = content;
      
      for (const { regex, replace } of replacements) {
        content = content.replace(regex, replace);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated: ${filePath}`);
      }
    }
  }
}

processDirectory(SRC_DIR);
console.log('Refactoring complete.');
