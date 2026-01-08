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
          let safeUserId = '';
          let previousUrl = '';
          let fileData = null;
          let fileInfo = null;
          let responded = false;

          busboy.on('field', (name, value) => {
            if (name === 'userId') {
              userId = value;
              safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, '');
            }
            if (name === 'previousUrl') {
              previousUrl = value;
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

              // Attempt to delete the previous avatar file if provided
              if (previousUrl) {
                try {
                  const previousFileName = path.basename(previousUrl);
                  if (previousFileName) {
                    const legacyPath = path.join(
                      process.cwd(),
                      'public',
                      'avatars',
                      safeUserId,
                      previousFileName,
                    );
                    const flatPath = path.join(
                      process.cwd(),
                      'public',
                      'avatars',
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
      name: 'building-upload-middleware',
      configureServer(server) {
        server.middlewares.use('/api/upload-building', (req, res, next) => {
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
            // Flat folder: store all building images directly under /public/building
            const savedFileName = `building-${safeCampaignId}-${timestamp}${ext}`;

            const targetDir = path.join(process.cwd(), 'public', 'building');
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
                      'building',
                      safeCampaignId,
                      previousFileName,
                    );
                    const flatPath = path.join(
                      process.cwd(),
                      'public',
                      'building',
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
                url: `/building/${savedFileName}`,
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
      name: 'player-upload-middleware',
      configureServer(server) {
        server.middlewares.use('/api/upload-player', (req, res, next) => {
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
            // Store player images in /public/players
            const savedFileName = `player-${safeCampaignId}-${timestamp}${ext}`;

            const targetDir = path.join(process.cwd(), 'public', 'players');
            fs.mkdirSync(targetDir, { recursive: true });
            const targetPath = path.join(targetDir, savedFileName);

            try {
              fs.writeFileSync(targetPath, fileData);

              // Attempt to delete previous image file if provided
              if (previousUrl) {
                try {
                  const previousFileName = path.basename(previousUrl);
                  if (previousFileName) {
                    const legacyPath = path.join(
                      process.cwd(),
                      'public',
                      'players',
                      safeCampaignId,
                      previousFileName,
                    );
                    const flatPath = path.join(
                      process.cwd(),
                      'public',
                      'players',
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
                url: `/players/${savedFileName}`,
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
      name: 'event-upload-middleware',
      configureServer(server) {
        server.middlewares.use('/api/upload-event', (req, res, next) => {
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
            // Store event images in /public/Events
            const savedFileName = `event-${safeCampaignId}-${timestamp}${ext}`;

            const targetDir = path.join(process.cwd(), 'public', 'Events');
            fs.mkdirSync(targetDir, { recursive: true });
            const targetPath = path.join(targetDir, savedFileName);

            try {
              fs.writeFileSync(targetPath, fileData);

              // Attempt to delete previous image file if provided
              if (previousUrl) {
                try {
                  const previousFileName = path.basename(previousUrl);
                  if (previousFileName) {
                    const flatPath = path.join(
                      process.cwd(),
                      'public',
                      'Events',
                      previousFileName,
                    );

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
                url: `/Events/${savedFileName}`,
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
      name: 'entity-upload-middleware',
      configureServer(server) {
        server.middlewares.use('/api/upload-entity', (req, res, next) => {
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
            // Store entity images in /public/entities
            const savedFileName = `entity-${safeCampaignId}-${timestamp}${ext}`;

            const targetDir = path.join(process.cwd(), 'public', 'entities');
            fs.mkdirSync(targetDir, { recursive: true });
            const targetPath = path.join(targetDir, savedFileName);

            try {
              fs.writeFileSync(targetPath, fileData);

              // Attempt to delete previous image file if provided
              if (previousUrl) {
                try {
                  const previousFileName = path.basename(previousUrl);
                  if (previousFileName) {
                    const legacyPath = path.join(
                      process.cwd(),
                      'public',
                      'entities',
                      safeCampaignId,
                      previousFileName,
                    );
                    const flatPath = path.join(
                      process.cwd(),
                      'public',
                      'entities',
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
                url: `/entities/${savedFileName}`,
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
          let previousUrl = '';
          let savedFileName = '';
          let savedFileBytes = 0;
          let mapId = '';
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
              // File writing is complete, but we'll delete previous file in the close event
              // to ensure everything is processed correctly
            });
          });

          busboy.on('close', () => {
            if (responded) return;
            if (!savedFileName || !safeCampaignId) {
              sendJson(400, { error: 'No file uploaded' });
              return;
            }

            // Attempt to delete previous map image if provided (after file is fully processed)
            if (previousUrl) {
              try {
                const previousFileName = path.basename(previousUrl);
                if (previousFileName) {
                  const previousPath = path.join(
                    process.cwd(),
                    'public',
                    'Main-Maps',
                    previousFileName
                  );

                  // Delete previous main map file
                  if (fs.existsSync(previousPath)) {
                    try {
                      fs.unlinkSync(previousPath);
                      console.log('Successfully deleted previous main map:', previousFileName);
                    } catch (deleteError) {
                      console.error('Error deleting previous main map:', deleteError);
                    }
                  } else {
                    console.log('Previous main map file does not exist:', previousFileName);
                  }
                } else {
                  console.log('No filename extracted from previousUrl');
                }
              } catch (error) {
                console.error('Error in previous map deletion process:', error);
              }
            } else {
              console.log('No previousUrl provided for map upload');
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
    {
      name: 'delete-image-middleware',
      configureServer(server) {
        server.middlewares.use('/api/delete-image', (req, res, next) => {
          if (req.method !== 'POST') return next();

          const sendJson = (status, body) => {
            res.statusCode = status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(body));
          };

          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });

          req.on('end', () => {
            try {
              const { imageUrl } = JSON.parse(body);
              
              if (!imageUrl) {
                sendJson(400, { error: 'imageUrl is required' });
                return;
              }

              // Extract filename from imageUrl and validate it's safe
              const fileName = path.basename(imageUrl);
              if (!fileName || fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
                sendJson(400, { error: 'Invalid imageUrl' });
                return;
              }

              // Determine the image type and corresponding directory
              let targetDir;
              if (fileName.startsWith('event-')) {
                targetDir = path.join(process.cwd(), 'public', 'Events');
              } else if (fileName.startsWith('location-')) {
                targetDir = path.join(process.cwd(), 'public', 'Locations');
              } else if (fileName.startsWith('building-')) {
                targetDir = path.join(process.cwd(), 'public', 'building');
              } else if (fileName.startsWith('player-')) {
                targetDir = path.join(process.cwd(), 'public', 'players');
              } else if (fileName.startsWith('entity-')) {
                targetDir = path.join(process.cwd(), 'public', 'entities');
              } else if (fileName.startsWith('avatar-')) {
                targetDir = path.join(process.cwd(), 'public', 'avatars');
              } else if (fileName.startsWith('main-')) {
                targetDir = path.join(process.cwd(), 'public', 'Main-Maps');
              } else {
                // For now, handle all known image types
                console.log('Skipping deletion of unrecognized image type:', fileName);
                sendJson(200, { success: true, message: 'Unrecognized image type, skipping deletion' });
                return;
              }

              const filePath = path.join(targetDir, fileName);
              
              if (fs.existsSync(filePath)) {
                try {
                  fs.unlinkSync(filePath);
                  console.log('Successfully deleted image:', fileName);
                  sendJson(200, { success: true, message: 'Image deleted successfully' });
                } catch (deleteError) {
                  console.error('Failed to delete image:', deleteError);
                  sendJson(500, { error: 'Failed to delete image file' });
                }
              } else {
                // File doesn't exist, but that's okay - consider it successful
                console.log('Image file not found, considering deletion successful:', fileName);
                sendJson(200, { success: true, message: 'Image not found, but deletion considered successful' });
              }
            } catch (parseError) {
              console.error('Error parsing delete-image request:', parseError);
              sendJson(400, { error: 'Invalid JSON in request body' });
            }
          });
        });
      },
    },
  ],
});
