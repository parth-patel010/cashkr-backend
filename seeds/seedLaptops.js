import { fork } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const brandSeeds = [
  'seedLaptopApple.js',
  'seedLaptopDell.js',
  'seedLaptopHP.js',
  'seedLaptopLenovo.js',
  'seedLaptopAsus.js',
  'seedLaptopAcer.js',
  'seedLaptopMicrosoft.js',
  'seedLaptopMSI.js',
  'seedLaptopRazer.js',
];

async function runSeed(scriptName) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, scriptName);
    console.log(`Running seed: ${scriptName}...`);
    const child = fork(scriptPath);

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script ${scriptName} exited with code ${code}`));
      }
    });
  });
}

async function runAllSeeds() {
  for (const seedScript of brandSeeds) {
    try {
      await runSeed(seedScript);
    } catch (err) {
      console.error(`❌ Failed to run ${seedScript}:`, err.message);
      process.exit(1);
    }
  }
  console.log('✅ All laptop brand seeds executed successfully.');
  process.exit(0);
}

runAllSeeds();

