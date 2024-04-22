const ImageModel = require('../../model/image.js');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assets/uploads/');
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const originalname = file.originalname;
    const extension = path.extname(originalname);
    const filename = `${timestamp}${extension}`;
    cb(null, filename);
  }
});

const fileFilter = function (req, file, cb) {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('File type not supported. Only JPG, PNG, and PDF files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: fileFilter
});

function imageController() {
  return {
    uploadImage: async (req, res) => {
      try {
        upload.single('image')(req, res, async function (err) {
          if (err instanceof multer.MulterError) {
            req.flash('error', 'File size exceeds 10MB limit');
            return res.redirect('/admin/add');
          } else if (err) {
            req.flash('error', err.message);
            return res.redirect('/admin/add');
          }

          const { title, category } = req.body;
          const imagePath = req.file.filename;

          const existingImage = await ImageModel.findOne({ title });
          console.log(existingImage); // Add this line
          if (existingImage) {
            req.flash('error', 'Title already exists');
            return res.redirect('/admin/add');
          }

          const newImage = new ImageModel({
            title: title,
            category: category,
            imagePath: imagePath
          });

          await newImage.save();

          req.flash('success', 'Image uploaded successfully');

          return res.redirect('/admin/add');
        });
      } catch (err) {
        console.error(err);
        req.flash('error', 'Error uploading image');
        res.redirect('/admin/add');
      }
    },

    search: async (req, res) => {
      try {
        const title = req.query.title; // Assuming title is passed as a query parameter
    
        console.log("Search title:", title); // Log the title for debugging
    
        // Search for the image with the provided title
        const image = await ImageModel.findOne({ title: title });
    
        console.log("Found image:", image); // Log the image object for debugging
    
        if (!image) {
          console.log("Image not found");
          req.flash('error', 'Image not found');
          return res.redirect("/");
        }
    
        // If image found, construct the file path
        const imagePath = image.imagePath;
    
        console.log("Image path:", imagePath); // Log the image path for debugging
    
        // Render the imagePage template with the image path
        res.render('user/imagePage', { layout: 'user/layout', imagePath });
        
    
      } catch (err) {
        console.error("Error:", err); // Log any errors for debugging
        req.flash('error', 'Internal Server Error');
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
    

  };
}


module.exports = imageController;
