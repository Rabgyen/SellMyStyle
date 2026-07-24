const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadDir = path.join(__dirname, '..', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Save uploaded file and return the relative path
 * @param {Object} file - File object from multer
 * @param {String} prefix - Prefix for the filename
 * @returns {String} Relative path to the saved file
 */
const saveFile = (file, prefix) => {
  // Generate unique filename
  const fileExtension = file.originalname.split('.').pop();
  const filename = `${prefix}_${uuidv4()}.${fileExtension}`;
  const filePath = path.join(uploadDir, filename);
  
  // Move file to upload directory
  fs.writeFileSync(filePath, file.buffer);
  
  // Return relative path for database storage
  return `/uploads/${filename}`;
};

module.exports = { saveFile };
