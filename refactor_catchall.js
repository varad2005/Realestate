import fs from 'fs';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src');

const colorMap = {
  gray: 'muted', slate: 'muted', zinc: 'muted', neutral: 'muted', stone: 'muted',
  pink: 'primary', rose: 'primary',
  blue: 'secondary', indigo: 'secondary', sky: 'secondary',
  emerald: 'success', green: 'success',
  red: 'destructive',
  orange: 'warning', yellow: 'warning', amber: 'warning',
  teal: 'accent', cyan: 'accent',
  violet: 'accent', purple: 'accent', fuchsia: 'accent'
};

const regex = /\b(bg|text|border|ring|stroke|fill|from|to|via)-(gray|slate|zinc|neutral|stone|pink|blue|emerald|red|orange|yellow|green|teal|cyan|sky|indigo|violet|purple|fuchsia|rose|amber)-[0-9]{2,3}\b/g;

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
      
      content = content.replace(regex, (match, prefix, color) => {
        let semantic = colorMap[color];
        
        // Handle special gray cases for backgrounds and texts to maintain readability
        if (semantic === 'muted') {
           if (prefix === 'bg' && match.includes('50') && !match.includes('500')) return 'bg-surface';
           if (prefix === 'bg' && match.includes('100')) return 'bg-surface/80';
           if (prefix === 'text' && (match.includes('900') || match.includes('800') || match.includes('700'))) return 'text-foreground';
           if (prefix === 'border' && (match.includes('200') || match.includes('300'))) return 'border-border';
        }
        
        // Handle opacities generally
        let opacity = '';
        if (match.includes('50') && !match.includes('500')) opacity = '/10';
        else if (match.includes('100')) opacity = '/20';
        else if (match.includes('200')) opacity = '/40';
        else if (match.includes('300')) opacity = '/60';
        else if (match.includes('400')) opacity = '/80';
        else if (match.includes('800') || match.includes('900')) {
            // Keep them solid unless it's text, which we might want to keep solid too
        }

        return `${prefix}-${semantic}${opacity}`;
      });

      // Also clean up hover states
      const hoverRegex = /\bhover:(bg|text|border|ring)-(gray|slate|zinc|neutral|stone|pink|blue|emerald|red|orange|yellow|green|teal|cyan|sky|indigo|violet|purple|fuchsia|rose|amber)-[0-9]{2,3}\b/g;
      content = content.replace(hoverRegex, (match, prefix, color) => {
        let semantic = colorMap[color];
        
        if (semantic === 'muted') {
           if (prefix === 'bg' && match.includes('50') && !match.includes('500')) return 'hover:bg-surface';
           if (prefix === 'text' && (match.includes('900') || match.includes('800'))) return 'hover:text-foreground';
           if (prefix === 'border' && match.includes('200')) return 'hover:border-border';
        }

        let opacity = '';
        if (match.includes('50') && !match.includes('500')) opacity = '/10';
        else if (match.includes('100')) opacity = '/20';
        else if (match.includes('200')) opacity = '/40';
        
        return `hover:${prefix}-${semantic}${opacity}`;
      });
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated catchall: ${filePath}`);
      }
    }
  }
}

processDirectory(SRC_DIR);
console.log('Catchall refactoring complete.');
