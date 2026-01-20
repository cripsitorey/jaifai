
const fs = require('fs');
try {
    const content = fs.readFileSync('execution_downgrade.log', 'utf8');
    const lines = content.split('\n');
    lines.forEach(line => {
        if (line.includes('AdminModule') || line.includes('Error') || line.includes('NestApplication')) {
            console.log(line.trim());
        }
    });
} catch (e) {
    console.log('Error reading log:', e.message);
}
