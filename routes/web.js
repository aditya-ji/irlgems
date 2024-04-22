
const loginController = require('../app/http/controller/loginController')
const imageController = require('../app/http/controller/imageController')
const guests = require('../app/http/middleware/guest')
const ImageModel = require('../app/model/image.js');

const fetchImagesMiddleware = async (req, res, next) => {
    try {
        // Fetch all images from the database
        const images = await ImageModel.find();
        images.forEach(image => {
            console.log('Image Path:', image.imagePath);
        });
        // Attach images to the request object
        req.images = images;
        next();
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error fetching images');
        res.redirect('/admin/add');
    }
};
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next(); // If user is authenticated, continue to the next middleware
    }
    // If user is not authenticated, redirect to login page
    res.redirect('/admin');
};
function initRout(app) {


    app.get('/', (req, res) => {
        res.render('user/home', { layout: 'user/layout', message: req.flash('error') });
    })

    app.get('/about', (req, res) => {
        res.render('user/about', { layout: 'user/layout' });
    })


    app.get('/contact', (req, res) => {
        res.render('user/contact', { layout: 'user/layout' });
    })

    app.get('/gallery', (req, res) => {
        res.render('user/gallery', { layout: 'user/layout' });
    })
    app.get('/service', (req, res) => {
        res.render('user/service', { layout: 'user/layout' });
    })


    app.get('/admin', loginController().login)
    app.post('/admin', loginController().postLogin)
    app.post('/logout', loginController().logout)
    app.post('/upload', imageController().uploadImage);
    app.get('/search', imageController().search);

    app.get('/images', fetchImagesMiddleware, (req, res) => {
        
        // Render the images page and pass the images data to it
        res.render('admin/admin_view_report', { layout: 'admin/admin_layout', images: req.images });
    });
    app.post('/delete/:id', async (req, res) => {
        try {
            // Extract the image ID from the request parameters
            const imageId = req.params.id;

            // Delete the image from the database
            await ImageModel.findByIdAndDelete(imageId);

            // Redirect back to the images page after deletion
            res.redirect('/images');
        } catch (err) {
            console.error(err);
            req.flash('error', 'Error deleting image');
            res.redirect('/images');
        }
    });


    app.get('/admin/home',isAuthenticated, fetchImagesMiddleware, (req, res) => {
        res.render('admin/admin_home', { layout: 'admin/admin_layout', images: req.images });
    });
    

    app.get('/admin/view', isAuthenticated,fetchImagesMiddleware, (req, res) => {
        // Render the admin view report page and pass the images data to it
        res.render('admin/admin_view_report', { layout: 'admin/admin_layout', images: req.images });
    });

    app.get('/admin/add',isAuthenticated,fetchImagesMiddleware, (req, res) => {
        res.render('admin/admin_add_report', { layout: 'admin/admin_layout', successMessage: req.flash('success'), errorMessage: req.flash('error'), images: req.images  });
    })
}


module.exports =
    initRout
