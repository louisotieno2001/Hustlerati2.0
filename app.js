require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const axios = require('axios');
const { Pool } = require('pg');
const crypto = require('crypto');
const pgSession = require('connect-pg-simple')(session);
const cors = require('cors');
const multer = require('multer');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cookieParser = require('cookie-parser');
const FormData = require('form-data');
const PORT = process.env.PORT || 3000;
// Directus API configuration
const url = process.env.DIRECTUS_URL;
const accessToken = process.env.DIRECTUS_TOKEN;
// Initialize multer for multiple files
const apiProxy = createProxyMiddleware({
    target: 'http://0.0.0.0:8055/assets', // Target server where requests should be proxied
    changeOrigin: true, // Adjust the origin of the request to the target
});

// PostgreSQL connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false },
});

// Use the proxy middleware for all requests to /assets
app.use('/assets', apiProxy);

// Middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' })); // Add JSON parsing middleware with increased limit
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(cors());
app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session',
    }),
    secret: 'sqT_d_qxWqHyXS6Yk7Me8APygz3EjFE8',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
    },
}));

const checkSession = (req, res, next) => {
    if (req.session.user) {
        next(); // Continue to the next middleware or route
    } else {
        res.redirect('/'); // Redirect to the login page if no session is found
    }
};

/**
    @param path  {String}
    @param config {RequestInit}
*/

// Query function for Directus API
async function query(path, config) {
    try {
        const res = await fetch(encodeURI(`${url}${path}`), {
            headers:
            {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            ...config
        });
        return res;
    } catch (error) {
        console.error('Error during fetch:', error);
        throw new Error('Database connection failed.');
    }
}

// Initialize multer without disk storage
const upload = multer().single('media'); // Use memory storage

// Upload to directus files
async function uploadToDirectus(file) {
    const formData = new FormData();
    formData.append('file', file.buffer, { filename: file.originalname, contentType: file.mimetype }); // Append the file buffer with metadata

    try {
        const res = await query(`/files`, {
            method: 'POST',
            body: formData,
            headers: formData.getHeaders(), // Set the correct headers for FormData
        });

        console.log
        const uploadedAsset = await res.json();
        return uploadedAsset; // Return uploaded asset data
    } catch (error) {
        console.error('Error uploading to Directus:', error);
        throw new Error('Failed to upload file to Directus');
    }
}

app.get('/', (req, res) => {
    res.render('index');
});
const loginRoutes = require('./routes/login');
app.use('/login', loginRoutes);
const signupRoutes = require('./routes/signup');
app.use('/signup', signupRoutes);
const dashboardRoutes = require('./routes/dashboard');
app.use('/dashboard', dashboardRoutes, checkSession);
const realEstateRoutes = require('./routes/real_estate');
app.use('/real_estate', realEstateRoutes);
const shopRoutes = require('./routes/shop');
app.use('/shop', shopRoutes);
const suspendedAccountRoutes = require('./routes/suspended_account');
app.use('/suspended_account', suspendedAccountRoutes);
const emailVerificationNoticeRoutes = require('./routes/email_verification_notice');
app.use('/email-verification-notice', emailVerificationNoticeRoutes);
const tosAndPrivacyRoutes = require('./routes/tos_and_privacy');
app.use('/tos-and-privacy', tosAndPrivacyRoutes);
const submitEstateRoutes = require('./routes/submit_estate');
app.use('/list-your-estate', submitEstateRoutes);
const solutionsRoutes = require('./routes/solutions');
app.use('/solutions', solutionsRoutes);
const aboutRoutes = require('./routes/about');
app.use('/about', aboutRoutes);
const siteMap = require('./routes/sitemap');
app.use('/sitemap', siteMap);
const preferencesRoute = require('./routes/preferences');
app.use('/preferences', preferencesRoute);
const accessibilityRoute = require('./routes/accessibility');
app.use('/accessibility', accessibilityRoute);
const helpCenter = require('./routes/help_center');
app.use('/help-center', helpCenter);
const resourceRoute = require('./routes/resources');
app.use('/resources', resourceRoute);
const faqRoute = require('./routes/faqs');
app.use('/faqs', faqRoute);
const bookRoute = require('./routes/bookings');
const { Console } = require('console');
app.use('/booking', bookRoute)

async function registerUser(userData) {
    let res = await query(`/items/users/`, {
        method: 'POST',
        body: JSON.stringify(userData) // Send user data in the request body
    });
    return await res.json();
}

app.post('/register', async (req, res) => {
    try {
        const { fullName, email, phone, password, terms } = req.body;

        if (!fullName || !email || !phone || !password || !terms) {
            return res.status(400).json({ error: 'Please fill in all fields' });
        }

        const userData = {
            name: fullName, email: email, phone: phone, password: password, tos_and_privacy_agreement: terms
        };

        // Register the user
        const newUser = await registerUser(userData);

        // Send response indicating success
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error inserting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function loginUser(email) {
    try {
        // Query the database for a user with the given email and password
        const response = await query(`/items/users?filter[email][_eq]=${email}`, {
            method: 'SEARCH',
        });
        const users = await response.json(); // Extract JSON data from the response

        // Return the users found
        return users;
    } catch (error) {
        console.error('Error querying user data:', error);
        throw new Error('Error querying user data');
    }
}

// Login route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(req.body)

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Please fill in all fields' });
        }

        // const userData = { email, password };

        // Fetch user data from Directus
        const usersResponse = await loginUser(email);

        // Check if users array is empty or not
        if (!usersResponse || !usersResponse.data || usersResponse.data.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = usersResponse.data[0];

        // console.log(user)
        const isPasswordValid = password === user.password;

        console.log("Password", password, "User Password", user.password, "Is Password Valid", isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // // Check user status
        if (user.suspend) {
            req.session.user = user; // Store user data in session
            return res.status(200).json({ message: 'Login successful', redirect: '/suspended_account' });
        } else {
            req.session.user = user; // Store user data in session
            return res.status(200).json({ message: 'Login successful', redirect: '/dashboard' });
        }
    } catch (error) {
        // Handle internal server error
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function uploadRealEstate(userData) {
    try {
        // Use your custom query function to send the update query
        const res = await query(`/items/real_estates/`, {
            method: 'POST', // Assuming you want to update an existing item
            body: JSON.stringify(userData) // Convert userData to JSON string
        });
        const updatedData = await res.json();
        return updatedData; // Return updated data
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to update');
    }
}

app.post('/submit-estate', async (req, res) => {
    try {
        const data = req.body;

        const requiredFields = [
            'propertyTitle', 'propertyType', 'propertySize', 'monthlyPrice',
            'propertyDescription', 'propertyCity', 'propertyAddress', 'propertyZipCode',
            'spaceType', 'leaseTerms', 'availability', 'contactName', 'contactPhone', 'contactEmail'
        ];

        const missingFields = requiredFields.filter(field => !data[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Prepare property data for Directus without images
        const propertyData = {
            title: data.propertyTitle,
            property_type: data.propertyType,
            size: String(data.propertySize),
            price: String(data.monthlyPrice),
            description: data.propertyDescription,
            city: data.propertyCity,
            location: data.propertyAddress,
            space_type: data.spaceType,
            lease_terms: data.leaseTerms,
            availability: data.availability,
            business_size: data.businessSize || '',
            amenities: Array.isArray(data.amenities) ? data.amenities : [data.amenities].filter(Boolean),
            badge: data.badge || '',
            feature_this_estate: false,
            status: 'pending',
            date_created: new Date().toISOString(),
            date_updated: new Date().toISOString(),
            contact_name: data.contactName,
            contact_phone: data.contactPhone,
            contact_email: data.contactEmail
        };

        const response = await uploadRealEstate(propertyData);

        if (response.errors) {
            console.error('Directus error:', response.errors);
            return res.status(500).json({
                success: false,
                message: response.errors[0]?.message || 'Failed to save property listing'
            });
        }

        res.json({
            success: true,
            message: 'Property listing submitted successfully!',
            data: {
                id: response.data.id,
                ...propertyData
            }
        });

    } catch (error) {
        console.error('Error processing property submission:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again.'
        });
    }
});

async function bookSapce(userData) {
    try {
        // Use your custom query function to send the update query
        const res = await query(`/items/bookings/`, {
            method: 'POST', // Assuming you want to update an existing item
            body: JSON.stringify(userData) // Convert userData to JSON string
        });
        const updatedData = await res.json();
        return updatedData; // Return updated data
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to update');
    }
}

// POST route to handle booking
app.post('/book', checkSession, async (req, res) => {
    try {
        const { type, propertyId, propertyDescription, propertyPrice, price, propertyName, propertyLocation } = req.body;
        const userId = req.session.user.id;

        if (!type || !propertyId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!['individual', 'group'].includes(type)) {
            return res.status(400).json({ error: 'Invalid booking type' });
        }

        // Create booking in Directus
        const bookingData = {
            user_id: userId,
            property_id: propertyId,
            type,
            location: propertyLocation,
            name: propertyName,
            contribution: price,
            price: propertyPrice,
            description: propertyDescription
        };

        // console.log("Data", bookingData)

        const newBooking = await bookSapce(bookingData)

        // console.log(newBooking)
        return res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error('Error processing booking:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

async function uploadProfileImage(userData) {
    try {
        const res = await query(`/items/users?filter[id][_eq]=${userData.id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });

        console.log("From inside function ", res)
        const updatedData = await res.json();
        return updatedData; // Return updated data
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to update');
    }
}

// Update user profile
app.post('/upload-profile', upload, async (req, res) => {
    try {
        // Ensure that req.file contains the expected file information
        const id = req.session.user.id;

        // Ensure that req.file contains the expected file information
        if (!req.file) {
            return res.status(400).json({ message: 'No media uploaded' });
        }

        console.log(req.file);

        // Upload the file to Directus
        const uploadedAsset = await uploadToDirectus(req.file);

        console.log("Image",uploadedAsset)
        // Update userData object with profile_image field
        const userData = {
            id: id, // Assuming req.user contains user information
            profile_image: uploadedAsset.data,
        };

        console.log("IUserdata", userData);

        // Update user data with the new profile pic path
        const updatedData = await uploadProfileImage(userData);

        console.log("Updated data",updatedData.errors)

        res.status(201).json({ message: 'Profile picture updated successfully', updatedData });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ message: 'Failed to update profile picture. Please try again.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
