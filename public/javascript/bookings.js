document.addEventListener('DOMContentLoaded', function() {
    // Individual booking
    document.getElementById('book-individual').addEventListener('click', async function() {
        let propertyId = this.getAttribute('data-id')
        let propertyName = this.getAttribute('data-name')
        let propertyDescription = this.getAttribute('data-description')
        let propertyLocation = this.getAttribute('data-location')
        let propertyPrice = this.getAttribute('data-price')
        const data = {
            type: 'individual',
            propertyId,
            propertyDescription,
            propertyLocation,
            propertyName,
            propertyPrice
        };

        try {
            const response = await fetch('/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.message === 'Success') {
                alert('Individual booking successful!');
                // Redirect to dashboard or confirmation page
                window.location.href = '/dashboard';
            } else {
                alert('Booking failed: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during booking.');
        }
    });

    // Shared booking
    document.getElementById('join-shared').addEventListener('click', async function() {
        const contribution = document.getElementById('contribution-amount').value;
        const linkStatus = document.getElementById('link_status').checked;
        if (!contribution || contribution <= 0 ) {
            alert('Please enter a valid contribution amount.');
            return;
        }

        const propertyId = this.getAttribute('data-id')
        let propertyName = this.getAttribute('data-name')
        let propertyDescription = this.getAttribute('data-description')
        let propertyLocation = this.getAttribute('data-location')
        let propertyPrice = this.getAttribute('data-price')

        const data = {
            type: 'group',
            price: parseFloat(contribution),
            propertyId,
            linkStatus,
            propertyDescription,
            propertyLocation,
            propertyName,
            propertyPrice
        };

        console.log(data)

        try {
            const response = await fetch('/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.message === 'Success') {
                alert('Shared booking successful!');
                // Redirect to dashboard or confirmation page
                window.location.href = '/dashboard';
            } else {
                alert('Booking failed: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during booking.');
        }
    });

    // Copy WhatsApp link
    document.getElementById('copy-link').addEventListener('click', function() {
        const link = document.getElementById('whatsapp-link').value;
        navigator.clipboard.writeText(link).then(function() {
            alert('Link copied to clipboard!');
        }).catch(function(err) {
            console.error('Could not copy text: ', err);
        });
    });
});
