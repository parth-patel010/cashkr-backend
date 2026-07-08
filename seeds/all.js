import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const seeds = [

    // ── Laptops ───────────────────────────────────────
    'seedLaptopAcer.js',
    'seedLaptopAsus.js',
    'seedLaptopAvita.js',
    'seedLaptopDell.js',
    'seedLaptopHP.js',
    'seedLaptopLenovo.js',
    'seedLaptopLg.js',
    'seedLaptopMi.js',
    'seedLaptopMicrosoft.js',
    'seedLaptopMSI.js',
    'seedLaptopSamsung.js',

    // ── Mac / iMac ────────────────────────────────────
    'seedIMac.js',

    // ── Tablets ───────────────────────────────────────
    'seedTabletSamsung.js',
    'seedTabletApple.js',
];

console.log(`\n🚀 Starting full seed run — ${seeds.length} files\n`);
console.log('═'.repeat(50));

let passed = 0;
let failed = 0;
const errors = [];

for (const file of seeds) {
    const filePath = path.join(__dirname, file);
    process.stdout.write(`⏳ Running ${file} ... `);
    try {
        execSync(`node ${filePath}`, { stdio: 'pipe' });
        console.log('✅ Done');
        passed++;
    } catch (err) {
        const msg = err.stderr?.toString().trim() || err.message;
        console.log('❌ Failed');
        errors.push({ file, msg });
        failed++;
    }
}

console.log('\n' + '═'.repeat(50));
console.log(`\n📊 Seed Summary:`);
console.log(`   ✅ Passed : ${passed}`);
console.log(`   ❌ Failed : ${failed}`);

if (errors.length > 0) {
    console.log('\n🔴 Errors:');
    for (const { file, msg } of errors) {
        console.log(`\n  [${file}]\n  ${msg}`);
    }
}

console.log('\n🏁 All seeds completed.\n');