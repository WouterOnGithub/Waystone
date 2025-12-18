import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import Busboy from 'busboy';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'avatar-upload-middleware',
      configureServer(server) {
        server.middlewares.use('/api/upload-avatar', (req, res, next) => {
          if (req.method !== 'POST') return next();

          const sendJson = (status, body) => {
            res.statusCode = status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(body));
          };

          const busboy = Busboy({
            headers: req.headers,
            limits: { files: 1, fileSize: 5 * 1024 * 1024 }, // 5MB limit
          });

          let userId = '';
          let fileData = null;
          let fileInfo = null;
          let responded = false;

          busboy.on('field', (name, value) => {
            if (name === 'userId') {
              userId = value;
            }
          });

          busboy.on('file', (name, file, info) => {
            if (name !== 'avatar') {
              file.resume();
              return;
            }
            const chunks = [];
            file.on('data', (chunk) => chunks.push(chunk));
            file.on('end', () => {
              fileData = Buffer.concat(chunks);
              fileInfo = info;
            });
          });

          busboy.on('close', () => {
            if (responded) return;
            
            const safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, '');
            if (!safeUserId || !fileData) {
              sendJson(400, { error: 'userId and avatar file are required' });
              return;
            }

            const ext = path.extname(fileInfo.filename || '') || '.jpg';
            const savedFileName = `avatar${ext}`;

            const targetDir = path.join(process.cwd(), 'public', 'avatars', safeUserId);
            fs.mkdirSync(targetDir, { recursive: true });
            const targetPath = path.join(targetDir, savedFileName);

            try {
              fs.writeFileSync(targetPath, fileData);
              sendJson(200, {
                fileName: savedFileName,
                url: `/avatars/${safeUserId}/${savedFileName}`,
              });
            } catch (err) {
              sendJson(500, { error: 'Failed to save file' });
            }
          });

          req.pipe(busboy);
        });
      },
    },
    {
      name: 'map-upload-middleware',
      configureServer(server) {
        server.middlewares.use('/api/upload-map', (req, res, next) => {
          if (req.method !== 'POST') return next();

          const sendJson = (status, body) => {
            res.statusCode = status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(body));
          };

          const busboy = Busboy({
            headers: req.headers,
            limits: { files: 1, fileSize: 10 * 1024 * 1024 }, // 10MB limit
          });

          let userId = '';
          let safeUserId = '';
          let savedFileName = '';
          let savedFileBytes = 0;
          let mapId = '';
          let responded = false;

          busboy.on('field', (name, value) => {
            if (name === 'userId') {
              userId = value;
              safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, '');
            }
          });

          busboy.on('file', (name, file, info) => {
            if (name !== 'map') {
              file.resume();
              return;
            }
            if (!userId || !safeUserId) {
              responded = true;
              file.resume();
              sendJson(400, { error: 'userId is required' });
              return;
            }

            const { filename } = info;
            const ext = path.extname(filename || '') || '';
            const base = path
              .basename(filename || 'map', ext)
              .replace(/[^a-zA-Z0-9._-]/g, '');
            mapId = `${Date.now()}_${base || 'map'}`;
            savedFileName = `${mapId}${ext}`;

            const targetDir = path.join(process.cwd(), 'public', 'Main-Maps', safeUserId);
            fs.mkdirSync(targetDir, { recursive: true });
            const targetPath = path.join(targetDir, savedFileName);

            const writeStream = fs.createWriteStream(targetPath);
            file.on('data', (chunk) => {
              savedFileBytes += chunk.length;
            });
            file.pipe(writeStream);

            writeStream.on('error', () => {
              if (responded) return;
              responded = true;
              sendJson(500, { error: 'Failed to save file' });
            });

            writeStream.on('finish', () => {
              // nothing; response in close handler
            });
          });

          busboy.on('close', () => {
            if (responded) return;
            if (!savedFileName || !safeUserId) {
              sendJson(400, { error: 'No file uploaded' });
              return;
            }
            sendJson(200, {
              url: `/Main-Maps/${safeUserId}/${savedFileName}`,
              name: savedFileName,
              size: savedFileBytes,
              id: mapId,
            });
          });

          req.pipe(busboy);
        });
      },
    },
  ],
});
