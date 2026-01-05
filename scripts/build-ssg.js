import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let PREVIEW_PORT = 4173;
let PREVIEW_URL = `http://localhost:${PREVIEW_PORT}`;

// Start preview server
function startPreviewServer() {
  return new Promise((resolve, reject) => {
    console.log('Starting preview server...');
    const server = spawn('npm', ['run', 'preview'], {
      shell: true,
      stdio: 'pipe',
      cwd: join(__dirname, '..')
    });

    let serverReady = false;

    server.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(output);
      // Extract port from output if it's different
      const portMatch = output.match(/Local:\s+http:\/\/localhost:(\d+)/);
      if (portMatch) {
        const actualPort = parseInt(portMatch[1]);
        PREVIEW_PORT = actualPort;
        PREVIEW_URL = `http://localhost:${actualPort}`;
        process.env.PREVIEW_URL = PREVIEW_URL;
        console.log(`Using port ${actualPort} instead of 4173`);
      }
      if (output.includes('Local:') || output.includes('localhost')) {
        if (!serverReady) {
          serverReady = true;
          console.log('Preview server is ready');
          setTimeout(resolve, 2000); // Wait 2 seconds for server to be fully ready
        }
      }
    });

    server.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    server.on('error', (error) => {
      reject(error);
    });

    // Store server process for later cleanup
    global.previewServer = server;
  });
}

// Stop preview server
function stopPreviewServer() {
  return new Promise((resolve) => {
    if (global.previewServer) {
      console.log('Stopping preview server...');
      global.previewServer.kill();
      global.previewServer.on('close', () => {
        console.log('Preview server stopped');
        resolve();
      });
    } else {
      resolve();
    }
  });
}

// Run SSG pre-rendering
async function runSSG() {
  const { default: generateStatic } = await import('./generate-static.js');
  // The generate-static.js will be executed directly
}

// Main build process
async function buildSSG() {
  try {
    // Step 1: Build the app
    console.log('Step 1: Building application...');
    await new Promise((resolve, reject) => {
      const build = spawn('npm', ['run', 'build'], {
        shell: true,
        stdio: 'inherit',
        cwd: join(__dirname, '..')
      });

      build.on('close', (code) => {
        if (code === 0) {
          console.log('✓ Build complete');
          resolve();
        } else {
          reject(new Error(`Build failed with code ${code}`));
        }
      });
    });

    // Step 2: Start preview server
    await startPreviewServer();

    // Step 3: Run pre-rendering
    console.log('Step 2: Pre-rendering static pages...');
    // PREVIEW_URL is already set in the server ready handler
    const { default: generateStatic } = await import('./generate-static.js');
    // generate-static.js exports a default function that we can call
    // For now, we'll execute it as a script
    const { spawn: spawnSSG } = await import('child_process');
    await new Promise((resolve, reject) => {
      const ssg = spawnSSG('node', ['scripts/generate-static.js'], {
        shell: true,
        stdio: 'inherit',
        cwd: join(__dirname, '..'),
        env: { ...process.env, PREVIEW_URL }
      });

      ssg.on('close', (code) => {
        if (code === 0) {
          console.log('✓ Pre-rendering complete');
          resolve();
        } else {
          reject(new Error(`Pre-rendering failed with code ${code}`));
        }
      });
    });

    // Step 4: Generate sitemap and robots.txt
    console.log('Step 3: Generating sitemap and robots.txt...');
    await new Promise((resolve, reject) => {
      const sitemap = spawn('node', ['scripts/generate-sitemap.js'], {
        shell: true,
        stdio: 'inherit',
        cwd: join(__dirname, '..')
      });

      sitemap.on('close', (code) => {
        if (code === 0) {
          console.log('✓ Sitemap generated');
          resolve();
        } else {
          reject(new Error(`Sitemap generation failed with code ${code}`));
        }
      });
    });

    await new Promise((resolve, reject) => {
      const robots = spawn('node', ['scripts/generate-robots.js'], {
        shell: true,
        stdio: 'inherit',
        cwd: join(__dirname, '..')
      });

      robots.on('close', (code) => {
        if (code === 0) {
          console.log('✓ Robots.txt generated');
          resolve();
        } else {
          reject(new Error(`Robots.txt generation failed with code ${code}`));
        }
      });
    });

    // Step 5: Stop preview server
    await stopPreviewServer();

    console.log('\n✅ Static site generation complete!');
    console.log('All pages are now pre-rendered with static HTML.');
  } catch (error) {
    console.error('❌ Build failed:', error);
    await stopPreviewServer();
    process.exit(1);
  }
}

buildSSG();

