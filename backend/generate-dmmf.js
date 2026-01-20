
const { Prisma } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Try to access dmmf from Prisma export (as seen in check-prisma.ts keys)
// dmmf is usually on the exported object if not on Prisma class
const pkg = require('@prisma/client');
const dmmf = pkg.dmmf || pkg.Prisma.dmmf;

if (dmmf) {
    fs.writeFileSync(
        path.join(__dirname, 'src/admin/dmmf.json'),
        JSON.stringify(dmmf, null, 2)
    );
    console.log('DMMF generated successfully');
} else {
    console.error('Could not find dmmf in @prisma/client');
    process.exit(1);
}
