// downloadImage: async function(req, res) {
//     try {
//       const title = req.query.title; // Assuming title is passed as a query parameter
  
//       // Search for the image with the provided title
//       const image = await ImageModel.findOne({ title: title });
      
  
//       if (!image) {
//         return res.render("user/home", { layout: 'user/layout', dataFound: false, searched: true });
//       }
  
//       // If image found, construct the file path
//       const imagePath = path.join(__dirname, '../../../uploads', image.imagePath);
  
//       // Trigger the download of the image
//       res.render("user/home", { layout: 'user/layout', dataFound: true, searched: true, title: title });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   }