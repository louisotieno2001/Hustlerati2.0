const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const TOKEN = '4UEYrvnR7h5FlXELlFWjoZjZX9dnxdyS';

async function testPermissions() {
    console.log('Testing Directus API permissions...\n');

    try {
        // Test 1: GET real_estates (should work)
        console.log('1. Testing GET /items/real_estates...');
        const getResponse = await axios.get(`${DIRECTUS_URL}/items/real_estates`, {
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ GET real_estates: SUCCESS');
        console.log('Response:', getResponse.data);

        // Test 2: POST real_estates (this is failing)
        console.log('\n2. Testing POST /items/real_estates...');
        const testData = {
            title: 'Test Property',
            property_type: 'warehouse',
            size: 1000,
            price: 5000,
            description: 'Test property for permission check',
            city: 'Test City',
            location: 'Test Address',
            space_type: 'dedicated',
            lease_terms: 'monthly',
            availability: 'immediate',
            status: 'pending'
        };

        const postResponse = await axios.post(`${DIRECTUS_URL}/items/real_estates`, testData, {
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ POST real_estates: SUCCESS');
        console.log('Response:', postResponse.data);

        // Test 3: GET files (should work for image uploads)
        console.log('\n3. Testing GET /files...');
        const filesResponse = await axios.get(`${DIRECTUS_URL}/files`, {
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ GET files: SUCCESS');

    } catch (error) {
        console.log('❌ ERROR:', error.response?.data || error.message);

        if (error.response?.status === 403) {
            console.log('\n🔧 PERMISSION ISSUE DETECTED:');
            console.log('Your token lacks the necessary permissions.');
            console.log('Please check your Directus admin panel:');
            console.log('1. Go to Settings > Access Control');
            console.log('2. Find your token/role');
            console.log('3. Go to Permissions tab');
            console.log('4. Ensure real_estates collection has:');
            console.log('   - Create: ✅ Allow');
            console.log('   - Read: ✅ Allow');
            console.log('5. Ensure directus_files has:');
            console.log('   - Create: ✅ Allow');
            console.log('   - Read: ✅ Allow');
        }
    }
}

testPermissions();
