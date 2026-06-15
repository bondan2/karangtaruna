const fs = require('fs');
const path = require('path');
const dir = 'src/pages/dashboard';
const files = fs.readdirSync(dir);
files.forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const original = 'className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100"';
    const replacement = 'className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"';
    if (content.includes(original)) {
      fs.writeFileSync(filePath, content.replace(original, replacement));
      console.log('Updated ' + file);
    }
  }
});
