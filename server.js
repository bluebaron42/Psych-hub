import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import JSZip from 'jszip';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load or initialize modules registry
const MODULES_FILE = path.join(__dirname, 'modules.json');
let modulesRegistry = {};
if (fs.existsSync(MODULES_FILE)) {
  modulesRegistry = JSON.parse(fs.readFileSync(MODULES_FILE, 'utf-8'));
}

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Serve modules
app.use('/modules', express.static(path.join(__dirname, 'public', 'modules')));

// API to get modules registry
app.get('/api/modules', (req, res) => {
  res.json(modulesRegistry);
});

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Endpoint to upload and extract zip
app.post('/upload-module', upload.single('moduleZip'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const moduleName = req.body.moduleName;
  const zipPath = req.file.path;
  const extractPath = path.join(__dirname, 'public', 'modules', moduleName);

  try {
    // Ensure extract directory exists
    if (!fs.existsSync(extractPath)) {
      fs.mkdirSync(extractPath, { recursive: true });
    }

    // Read and extract zip
    const zipData = fs.readFileSync(zipPath);
    const zip = await JSZip.loadAsync(zipData);

    for (const [relativePath, file] of Object.entries(zip.files)) {
      if (!file.dir) {
        const filePath = path.join(extractPath, relativePath);
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        let content = await file.async('nodebuffer');

        // If it's index.html, fix absolute paths to relative and add dark theme
        if (relativePath === 'index.html') {
          let htmlContent = content.toString('utf-8');
          htmlContent = htmlContent.replace(/href="\/([^"]*)"/g, 'href="./$1"');
          htmlContent = htmlContent.replace(/src="\/([^"]*)"/g, 'src="./$1"');
          // Add dark background to body
          htmlContent = htmlContent.replace(/<body>/, '<body style="background-color: #0f172a; color: white;">');
          content = Buffer.from(htmlContent, 'utf-8');
        }

        fs.writeFileSync(filePath, content);
      }
    }

    // Register the module
    modulesRegistry[moduleName] = `/modules/${moduleName}/index.html`;
    fs.writeFileSync(MODULES_FILE, JSON.stringify(modulesRegistry, null, 2));

    // Clean up uploaded zip
    fs.unlinkSync(zipPath);

    res.send({ success: true, moduleName });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error extracting zip.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
