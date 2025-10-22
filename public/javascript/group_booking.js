document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('group-booking-form');
    const contributionInput = document.getElementById('contribution');
    const errorMessage = document.getElementById('contribution-error');
    const minContribution = 20; // Minimum for group booking

    form.addEventListener('submit', function(event) {
        const contribution = parseFloat(contributionInput.value);
        if (contribution < minContribution) {
            event.preventDefault();
            errorMessage.style.display = 'block';
            contributionInput.focus();
        } else {
            errorMessage.style.display = 'none';
        }
    });

    contributionInput.addEventListener('input', function() {
        const contribution = parseFloat(contributionInput.value);
        if (contribution >= minContribution) {
            errorMessage.style.display = 'none';
        }
    });
});
