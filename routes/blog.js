const express = require('express');
const router = express.Router();

// Query function for Directus API
const url = process.env.DIRECTUS_URL;
const accessToken = process.env.DIRECTUS_TOKEN;

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

async function getBlogs() {
    try {
        const response = await query(`/items/blogs?filter[publish][_eq]=true&fields=*,media.*`, {
            method: 'GET'
        });

        if (response.ok) {
            const blogData = await response.json();
            // console.log("Raw blog data:", JSON.stringify(blogData.data[0], null, 2)); // Debug log
            return blogData.data.map(normalizeblog);
        } else {
            throw new Error('Failed to fetch blogs');
        }
    } catch (error) {
        console.error('Error fetching blogs:', error);
        throw error;
    }
}

// Report Form
router.get('/',async (req, res) => {
    try {
        const blogs = await getBlogs()

        res.render('blog', { blogs });
    } catch (error) {
        console.error('Error in blog route:', error);
        res.status(500).render('blog', { blogs: [], error: 'Failed to load blogs' });
    }
});

// Get individual blog details
router.get('/:id', async (req, res) => {
    try {
        const blogId = req.params.id;
        const response = await query(`/items/blogs/${blogId}?fields=*,media.*`);

        if (!response.ok) {
            throw new Error('Failed to fetch blog');
        }

        const blogData = await response.json();
        const blogRaw = blogData.data;

        if (!blogRaw) {
            return res.status(404).render('readblog', {
                blog: null,
                error: 'Blog not found'
            });
        }

        const blog = normalizeblog(blogRaw);
        res.render('readblog', { blog, error: null });
    } catch (error) {
        console.error('Error fetching blog details:', error);
        res.status(500).render('readblog', {
            blog: null,
            error: 'Failed to load blog details'
        });
    }
});

function normalizeblog(blogRaw) {
    // console.log("Processing blog:", blogRaw.title, "Media structure:", blogRaw.media);
    
    const normalized = {
        id: blogRaw.id,
        title: blogRaw.title || '',
        body: blogRaw.body || '',
        media: null
    };

    // Check for different possible media field structures
    if (blogRaw.media) {
        // If media is an object (relationship or file object)
        if (typeof blogRaw.media === 'object' && blogRaw.media !== null) {
            // Check if it's a direct file object
            if (blogRaw.media.full_url || blogRaw.media.id) {
                normalized.media = {
                    id: blogRaw.media.id,
                    url: blogRaw.media.full_url ? `${url}${blogRaw.media.full_url}` : null,
                    filename_disk: blogRaw.media.filename_disk,
                    filename_download: blogRaw.media.filename_download,
                    type: blogRaw.media.type,
                    width: blogRaw.media.width,
                    height: blogRaw.media.height
                };
            }
        } else if (typeof blogRaw.media === 'string' && blogRaw.media.length > 0) {
            // If media is a string (filename/id reference)
            normalized.media = { id: blogRaw.media };
        }
    }
    
    // Check legacy media_data field (backup)
    else if (blogRaw.media_data && blogRaw.media_data.full_url) {
        normalized.media = {
            url: `${url}${blogRaw.media_data.full_url}`,
            id: blogRaw.media_data.id,
            filename_disk: blogRaw.media_data.filename_disk
        };
    }

    // console.log("Normalized media:", normalized.media);
    return normalized;
}

module.exports = router;
