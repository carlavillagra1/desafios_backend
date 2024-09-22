const multer = require('multer');
const path = require('path');

// Verifica y crea la carpeta "documents" si no existe
const documentsPath = path.resolve(__dirname, '../documents');
const fs = require('fs');
if (!fs.existsSync(documentsPath)) {
    fs.mkdirSync(documentsPath, { recursive: true });
}

// Configuración de Multer para la subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, documentsPath); 
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        cb(null, `${timestamp}-${file.originalname}`);
    }
});

const upload = multer({ storage });

module.exports = upload;
