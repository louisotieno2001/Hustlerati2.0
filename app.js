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
// Initialize multer without disk storage
const upload = multer().single('media'); // Use memory storage
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

async function uploadToDirectus(file) {
    const formData = new FormData();
    formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype
    });

    try {
        const res = await axios.post(`${url}/files`, formData, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                ...formData.getHeaders()
            }
        });
        return res.data;
    } catch (error) {
        console.error('Error uploading to Directus:', error.response?.data || error.message);
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

async function submitEstate(data) {
  let res = await query(`/items/real_estates/`, {
    method: 'POST',
    headers: { "Content-type" : "application/json"},
    body: JSON.stringify(data) // Send user data in the request body
  });
  return await res.json();
}

// New route to handle real estate submission
app.post('/submit-estate', async (req, res) => {
    try {
        const data = req.body;

        // Validate required fields
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

        // Validate images
        if (!data.images || data.images.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one image is required'
            });
        }

        if (data.images.length > 5) {
            return res.status(400).json({
                success: false,
                message: 'Maximum 5 images allowed'
            });
        }

        // Upload images to Directus
        const uploadedImageIds = [];
        for (const image of data.images) {
            // Validate image object structure
            if (!image || !image.base64 || !image.name) {
                console.error('Invalid image object:', image);
                return res.status(400).json({
                    success: false,
                    message: 'Invalid image data provided'
                });
            }

            try {
                // image.base64 contains base64 string, extract mime type and data
                const [mimePart, base64Data] = image.base64.split(',');
                if (!mimePart || !base64Data) {
                    console.error('Invalid base64 format for image:', image.name);
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid image format'
                    });
                }

                const mimeType = mimePart.split(':')[1].split(';')[0]; // Extract mime type from data:image/jpeg;base64,
                const buffer = Buffer.from(base64Data, 'base64');

                // Create a file-like object for upload
                const file = {
                    buffer: buffer,
                    originalname: image.name,
                    mimetype: mimeType
                };

                const uploadedAsset = await uploadToDirectus(file);
                uploadedImageIds.push(uploadedAsset.data.id);
            } catch (uploadError) {
                console.error('Error uploading image:', uploadError);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to upload one or more images'
                });
            }
        }

        // Prepare property data for Directus
        const propertyData = {
            title: data.propertyTitle,
            property_type: data.propertyType,
            size: parseInt(data.propertySize),
            price: parseInt(data.monthlyPrice),
            description: data.propertyDescription,
            city: data.propertyCity,
            location: data.propertyAddress,
            space_type: data.spaceType,
            lease_terms: data.leaseTerms,
            availability: data.availability,
            business_size: data.businessSize || '',
            amenities: Array.isArray(data.amenities) ? data.amenities : [data.amenities].filter(Boolean),
            images: uploadedImageIds, // Array of Directus file IDs (UUIDs)
            badge: data.badge || '',
            feature_this_estate: false,
            status: 'pending',
            date_created: new Date().toISOString(),
            date_updated: new Date().toISOString()
        };

        console.log("Property Data:", propertyData);

        // Save property listing to Directus real_estates table
        const response = await submitEstate(propertyData);

        console.log("Directus Response:", response);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Directus error:', errorData);
            return res.status(500).json({
                success: false,
                message: 'Failed to save property listing'
            });
        }

        const savedProperty = await response.json();

        res.json({
            success: true,
            message: 'Property listing submitted successfully!',
            data: {
                id: savedProperty.data.id,
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});