const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  // Replace https://loremflickr.com/W/H/tags?random=ID
  // with https://picsum.photos/seed/ID/W/H
  
  // Pattern 1: https://loremflickr.com/800/600/house,modern?random=788053
  content = content.replace(/https:\/\/loremflickr\.com\/(\d+)\/(\d+)\/[a-zA-Z,]+\?random=([a-zA-Z0-9${}.]+)/g, "https://picsum.photos/seed/$3/$1/$2");
  
  // Pattern 2: https://loremflickr.com/1920/1080/house,mansion?lock=10
  content = content.replace(/https:\/\/loremflickr\.com\/(\d+)\/(\d+)\/[a-zA-Z,]+\?lock=([a-zA-Z0-9${}.]+)/g, "https://picsum.photos/seed/$3/$1/$2");

  // Pattern 3: https://loremflickr.com/${w}/${h}/villa,modern?random=${id}
  content = content.replace(/https:\/\/loremflickr\.com\/\$\{([a-zA-Z0-9]+)\}\/\$\{([a-zA-Z0-9]+)\}\/[a-zA-Z,]+\?random=\$\{([a-zA-Z0-9.]+)\}/g, "https://picsum.photos/seed/${$3}/${$1}/${$2}");

  // Pattern 4: any leftover loremflickr with random
  content = content.replace(/https:\/\/loremflickr\.com\/[^\s'"`]+random=([a-zA-Z0-9${}.]+)/g, "https://picsum.photos/seed/$1/800/600");

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Updated', filePath);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
      processFile(full);
    }
  }
}

walk('./src');
