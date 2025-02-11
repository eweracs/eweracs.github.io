document.addEventListener('DOMContentLoaded', function () {
    // Get the "name" parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const fileName = urlParams.get('name') || 'Unknown File'; // Default to "Unknown File" if no name is provided

    // Add click event listener to the download button
    const downloadButton = document.getElementById('download-button');
    if (downloadButton) {
        downloadButton.addEventListener('click', function () {
            // Replace with your Formspree endpoint
            const formspreeEndpoint = 'https://formspree.io/f/xpwqjrpa';

            // Send data to Formspree
            fetch(formspreeEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subject: 'Files downloaded',
                    message: `${fileName} has been downloaded.` // Include the file name in the message
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Email sent successfully:', data);
            })
            .catch(error => {
                console.error('Error sending email:', error);
            });

            // Optionally, trigger the download here
            // window.location.href = 'path-to-your-file.zip'; // Replace with the actual file path
        });
    }
});