import fs from 'fs';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src');

const replacements = [
  // Text colors
  { regex: /\btext-(gray|slate|zinc|neutral|stone)-(900|800|700)\b/g, replace: 'text-foreground' },
  { regex: /\btext-(gray|slate|zinc|neutral|stone)-(600|500|400)\b/g, replace: 'text-muted' },
  { regex: /\btext-(gray|slate|zinc|neutral|stone)-(300|200|100|50)\b/g, replace: 'text-muted/50' },
  { regex: /\btext-black\b/g, replace: 'text-foreground' },

  // Background colors
  // Light grays usually mean surface or card
  { regex: /\bbg-(gray|slate|zinc|neutral|stone)-(50|100)\b/g, replace: 'bg-surface' },
  { regex: /\bbg-(gray|slate|zinc|neutral|stone)-(200|300)\b/g, replace: 'bg-surface/80' },
  // Darker grays might be dark mode or specific UI elements. Map to muted or primary/20
  { regex: /\bbg-(gray|slate|zinc|neutral|stone)-(400|500|600)\b/g, replace: 'bg-muted' },
  { regex: /\bbg-(gray|slate|zinc|neutral|stone)-(700|800|900)\b/g, replace: 'bg-foreground' },
  
  // Borders
  { regex: /\bborder-(gray|slate|zinc|neutral|stone)-[1-3]00\b/g, replace: 'border-border' },
  { regex: /\bborder-(gray|slate|zinc|neutral|stone)-[4-9]00\b/g, replace: 'border-muted' },
  
  // Rings
  { regex: /\bring-(gray|slate|zinc|neutral|stone)-[0-9]{2,3}\b/g, replace: 'ring-border' },
  
  // Hovers
  { regex: /\bhover:bg-(gray|slate|zinc|neutral|stone)-(50|100)\b/g, replace: 'hover:bg-surface' },
  { regex: /\bhover:bg-(gray|slate|zinc|neutral|stone)-(200|300)\b/g, replace: 'hover:bg-surface/80' },
  { regex: /\bhover:text-(gray|slate|zinc|neutral|stone)-(900|800|700)\b/g, replace: 'hover:text-foreground' },
  { regex: /\bhover:text-(gray|slate|zinc|neutral|stone)-(600|500|400)\b/g, replace: 'hover:text-muted' },
  { regex: /\bhover:border-(gray|slate|zinc|neutral|stone)-[0-9]{2,3}\b/g, replace: 'hover:border-border' },
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
        console.log(`Updated grayscale: ${filePath}`);
      }
    }
  }
}

processDirectory(SRC_DIR);
console.log('Grayscale refactoring complete.');
