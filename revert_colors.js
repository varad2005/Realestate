import fs from 'fs';
import path from 'path';

// Define mapping from semantic to hardcoded tailwind classes
const colorMap = {
    // Primary (pink)
    'text-primary': 'text-pink-600',
    'bg-primary': 'bg-pink-600',
    'border-primary': 'border-pink-600',
    'ring-primary': 'ring-pink-600',
    'hover:text-primary': 'hover:text-pink-600',
    'hover:bg-primary': 'hover:bg-pink-700',
    'bg-primary/10': 'bg-pink-50',
    'bg-primary/20': 'bg-pink-100',
    'text-primary/80': 'text-pink-500',
    
    // Grayscale (text, background, border)
    'text-foreground': 'text-gray-900',
    'text-muted': 'text-gray-500',
    'text-muted/50': 'text-gray-400',
    'text-muted/70': 'text-gray-500',
    'text-muted/80': 'text-gray-600',
    'text-muted-foreground': 'text-gray-500',
    'text-card-foreground': 'text-gray-900',
    
    'bg-surface': 'bg-gray-50',
    'bg-surface/50': 'bg-gray-50/50',
    'bg-surface/80': 'bg-gray-100',
    'bg-surface/90': 'bg-gray-100',
    'bg-background': 'bg-white',
    'bg-card': 'bg-white',
    'bg-muted': 'bg-gray-100',
    'bg-foreground': 'bg-gray-900',
    'hover:bg-surface': 'hover:bg-gray-50',
    'hover:bg-muted': 'hover:bg-gray-100',
    
    'border-border': 'border-gray-200',
    'border-muted': 'border-gray-300',
    'ring-border': 'ring-gray-200',
    
    // Semantic States
    'text-success': 'text-emerald-500',
    'bg-success': 'bg-emerald-500',
    'bg-success/10': 'bg-emerald-50',
    
    'text-destructive': 'text-red-500',
    'bg-destructive': 'bg-red-500',
    'bg-destructive/10': 'bg-red-50',
    
    'text-warning': 'text-yellow-500',
    'bg-warning': 'bg-yellow-500',
    'bg-warning/10': 'bg-yellow-50',
    
    'text-info': 'text-blue-500',
    'bg-info': 'bg-blue-500',
    'bg-info/10': 'bg-blue-50',
    
    // Secondary & Accent
    'text-secondary': 'text-indigo-600',
    'bg-secondary': 'bg-indigo-600',
    'text-accent': 'text-purple-600',
    'bg-accent': 'bg-purple-600',
    
    // Gradients
    'from-gradient-start': 'from-pink-600',
    'to-gradient-end': 'to-rose-600'
};

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Apply regex replacement for each color mapping
    for (const [semantic, hardcoded] of Object.entries(colorMap)) {
        // Match exact word boundaries for classes to avoid partial matches
        const regex = new RegExp(`\\b${semantic.replace(/\//g, '\\/')}\\b`, 'g');
        content = content.replace(regex, hardcoded);
    }
    
    // Also revert any inline fill or stroke that might have been hardcoded back to primary (e.g. from previous replace)
    // Actually we don't know the exact hex, so we'll leave inline alone, wait, there were some text-primary we missed? 
    // The previous refactor added semantic classes to fill/stroke occasionally, they will be caught by the above rules.
    // E.g., fill-primary -> fill-pink-600 (wait, we didn't add fill-primary to the map)
    content = content.replace(/\bfill-primary\b/g, 'fill-pink-600');
    content = content.replace(/\bstroke-primary\b/g, 'stroke-pink-600');
    
    if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    }
    return false;
}

function traverseDir(dir) {
    let modifiedCount = 0;
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            modifiedCount += traverseDir(fullPath);
        } else if (stat.isFile() && /\.(tsx|ts|jsx|js)$/.test(file)) {
            if (processFile(fullPath)) {
                console.log(`Reverted: ${fullPath}`);
                modifiedCount++;
            }
        }
    }
    return modifiedCount;
}

const targetDir = path.join(process.cwd(), 'src');
console.log('Starting color reversion...');
const total = traverseDir(targetDir);
console.log(`Reversion complete. Modified ${total} files.`);
