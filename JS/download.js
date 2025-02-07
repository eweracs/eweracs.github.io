// Function to get file name and handle download
async function setupFileDownload() {
    // Extract file ID from URL
    const fileId = window.location.pathname.split('/').pop();

    // Direct Google Drive download link
    const driveDownloadLink = `https://drive.google.com/uc?export=download&id=${fileId}`;

    try {
        const response = await fetch(`https://drive.google.com/uc?export=download&id=${fileId}`);

        if (!response.ok) {
            throw new Error('File not found');
        }

        const filename = response.headers.get('content-disposition')
            ?.split('filename=')[1]
            ?.replace(/"/g, '') || 'downloaded-file';

        document.getElementById('file-name').textContent = filename;
        const downloadButton = document.getElementById('download-button');
        downloadButton.href = driveDownloadLink;
        downloadButton.style.display = 'inline-block';
        document.getElementById('error-message').textContent = '';
    } catch (error) {
        document.getElementById('file-name').textContent = 'File Download';
        const downloadButton = document.getElementById('download-button');
        downloadButton.style.display = 'none';
        document.getElementById('error-message').textContent = 'File is no longer available or has expired.';
    }
}

// Run the setup when the page loads
window.addEventListener('DOMContentLoaded', setupFileDownload);