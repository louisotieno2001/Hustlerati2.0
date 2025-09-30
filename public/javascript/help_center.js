document.addEventListener('DOMContentLoaded', async () => {
    const submitBtn = document.getElementById('btn-submit');

    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault()

        const type = document.getElementById('type').value.trim();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim()

        if (!type || !name || !email || !message) {
            alert("All fields are necessary");
        } else {
            try {
                const response = await fetch('/message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        type: type,
                        name: name,
                        email: email,
                        message: message
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Message sent successful!');
                } else {
                    alert(`Message not sent: ${data.error}`);
                }

            } catch (error) {

            }
        }
    });
})