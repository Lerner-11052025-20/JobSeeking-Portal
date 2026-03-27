import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine automatically (image for PDFs, raw for DOCs)
    let resource_type = 'auto';
    
    // Create professional public_id with original name
    const originalName = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
    const publicId = `${originalName}_${Date.now()}`;

    return {
      folder: 'jobportal/resumes',
      resource_type: resource_type,
      public_id: publicId,
    };
  },
});

export { cloudinary, storage };
