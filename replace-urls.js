const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend/src');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('http://localhost:5000')) {
        // Add import
        if (!content.includes('import { API_URL }')) {
            const depth = fullPath.split('src')[1].split(path.sep).length - 2;
            const prefix = depth > 0 ? '../'.repeat(depth) : './';
            content = `import { API_URL } from '${prefix}config';\n` + content;
        }

        // Replace literal string concat
        content = content.replace(/'http:\/\/localhost:5000/g, 'API_URL + \'');
        // Replace inside template literals
        content = content.replace(/`http:\/\/localhost:5000/g, '`${API_URL}');
        
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

fs.writeFileSync(path.join(__dirname, 'frontend/src/config.js'), "export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';\n");

processDir(srcDir);
console.log("Done replacing URLs");
