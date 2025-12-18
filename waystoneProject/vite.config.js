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

            const safeUserId = (userId || '').replace(/[^a-zA-Z0-9_-]/g, '');
            if (!safeUserId || !fileData) {
              sendJson(400, { error: 'userId and avatar file are required' });
              return;
            }

            const ext = path.extname(fileInfo?.filename || '') || '.jpg';
            const timestamp = Date.now();
            // Flat folder: store all avatars directly under /public/avatars
            const savedFileName = `avatar-${safeUserId}-${timestamp}${ext}`;

            const targetDir = path.join(process.cwd(), 'public', 'avatars');
            fs.mkdirSync(targetDir, { recursive: true });
            const targetPath = path.join(targetDir, savedFileName);

            try {
              fs.writeFileSync(targetPath, fileData);
              sendJson(200, {
                fileName: savedFileName,
                url: `/avatars/${savedFileName}`,
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
      name: 'location-upload-middleware',
      configureServer(server) {
        server.middlewares.use('/api/upload-location', (req, res, next) => {
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

          let campaignId = '';
          let safeCampaignId = '';
          let previousUrl = '';
          let fileData = null;
          let fileInfo = null;
          let responded = false;

          busboy.on('field', (name, value) => {
            if (name === 'campaignId') {
              campaignId = value;
              safeCampaignId = campaignId.replace(/[^a-zA-Z0-9_-]/g, '');
            }
            if (name === 'previousUrl') {
              previousUrl = value;
            }
          });

          busboy.on('file', (name, file, info) => {
            if (name !== 'image') {
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

            if (!safeCampaignId || !fileData) {
              sendJson(400, { error: 'campaignId and image file are required' });
              return;
            }

            const ext = path.extname(fileInfo?.filename || '') || '.jpg';
            const timestamp = Date.now();
            // Flat folder: store all location images directly under /public/Locations
            const savedFileName = `location-${safeCampaignId}-${timestamp}${ext}`;

            const targetDir = path.join(process.cwd(), 'public', 'Locations');
            fs.mkdirSync(targetDir, { recursive: true });
            const targetPath = path.join(targetDir, savedFileName);

            try {
              fs.writeFileSync(targetPath, fileData);

              // Attempt to delete the previous image file if provided
              if (previousUrl) {
                try {
                  const previousFileName = path.basename(previousUrl);
                  if (previousFileName) {
                    const legacyPath = path.join(
                      process.cwd(),
                      'public',
                      'Locations',
                      safeCampaignId,
                      previousFileName,
                    );
                    const flatPath = path.join(
                      process.cwd(),
                      'public',
                      'Locations',
                      previousFileName,
                    );

                    // Delete legacy nested-path version
                    if (fs.existsSync(legacyPath)) {
                      try {
                        fs.unlinkSync(legacyPath);
                      } catch {
                        // ignore individual delete errors
                      }
                    }

                    // Delete flat-path version
                    if (fs.existsSync(flatPath)) {
                      try {
                        fs.unlinkSync(flatPath);
                      } catch {
                        // ignore individual delete errors
                      }
                    }
                  }
                } catch {
                  // ignore delete failures
                }
              }

              sendJson(200, {
                fileName: savedFileName,
                url: `/Locations/${savedFileName}`,
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

          let campaignId = '';
          let safeCampaignId = '';
          let savedFileName = '';
          let savedFileBytes = 0;
          let mapId = '';
          let responded = false;

          busboy.on('field', (name, value) => {
            if (name === 'campaignId') {
              campaignId = value;
              safeCampaignId = campaignId.replace(/[^a-zA-Z0-9_-]/g, '');
            }
          });

          busboy.on('file', (name, file, info) => {
            if (name !== 'map') {
              file.resume();
              return;
            }
            if (!campaignId || !safeCampaignId) {
              responded = true;
              file.resume();
              sendJson(400, { error: 'campaignId is required' });
              return;
            }

            const { filename } = info;
            const ext = path.extname(filename || '') || '';
            const base = path
              .basename(filename || 'map', ext)
              .replace(/[^a-zA-Z0-9._-]/g, '');

            mapId = safeCampaignId || `${Date.now()}_${base || 'map'}`;

            // Flat folder: store all main maps directly under /public/Main-Maps
            const timestamp = Date.now();
            savedFileName = `main-${safeCampaignId}-${timestamp}${ext}`;

            const targetDir = path.join(process.cwd(), 'public', 'Main-Maps');
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
            if (!savedFileName || !safeCampaignId) {
              sendJson(400, { error: 'No file uploaded' });
              return;
            }
            sendJson(200, {
              url: `/Main-Maps/${savedFileName}`,
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
