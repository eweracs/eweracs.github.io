// Function to get file name and handle download
function setupFileDownload() {
    // Get the file ID and name from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const fileId = urlParams.get('id');
    const fileName = urlParams.get('name') || 'Download File';

    // If no file ID is provided, show an error
    if (!fileId) {
        document.getElementById('file-name').textContent = 'File Download';
        const downloadButton = document.getElementById('download-button');
        downloadButton.style.display = 'none';
        document.getElementById('error-message').textContent = 'No file ID provided.';
        return;
    }

    // Direct Google Drive download link
    const driveDownloadLink = `https://drive.google.com/uc?id=${fileId}&export=download`;

    // Set file name
    document.getElementById('file-name').textContent = fileName;

    const downloadButton = document.getElementById('download-button');
    downloadButton.href = driveDownloadLink;
    downloadButton.style.display = 'inline-block';
}

// Run the setup when the page loads
window.addEventListener('DOMContentLoaded', setupFileDownload);