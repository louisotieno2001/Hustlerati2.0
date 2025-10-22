document.addEventListener('DOMContentLoaded', function() {
    // Individual booking - redirect to individual booking page
    document.getElementById('book-individual').addEventListener('click', function() {
        const propertyId = this.getAttribute('data-id');
        window.location.href = `/individual-booking/${propertyId}`;
    });

    // Shared booking - redirect to group booking page
    document.getElementById('join-shared').addEventListener('click', function() {
        const propertyId = this.getAttribute('data-id');
        window.location.href = `/group-booking/${propertyId}`;
    });

    // Copy WhatsApp link
    document.getElementById('copy-link').addEventListener('click', function() {
        const link = document.getElementById('whatsapp-link').href;
        navigator.clipboard.writeText(link).then(function() {
            alert('Link copied to clipboard!');
        }).catch(function(err) {
            console.error('Could not copy text: ', err);
        });
    });
});
