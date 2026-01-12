'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function DownloadClient() {
  const searchParams = useSearchParams();
  const [fileName, setFileName] = useState('Download File');
  const [fileId, setFileId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('id');
    const name = searchParams.get('name') || 'Download File';

    if (!id) {
      setError('No file ID provided.');
      return;
    }

    setFileId(id);
    setFileName(name);
  }, [searchParams]);

  const driveDownloadLink = fileId
    ? `https://drive.google.com/uc?id=${fileId}&export=download`
    : null;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-6">
      <div className="bg-blue-900 shadow-lg p-8 max-w-md w-full">
        <h1 className="text-xl text-white font-bold mb-4">Your files are ready:</h1>

        {error ? (
          <div className="text-white mb-4">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <p className="text-white mb-6">
              <span className="[font-variation-settings:'wght'_700]" id="file-name">{fileName}</span>
            </p>
            {driveDownloadLink && (
              <a
                id="download-button"
                href={driveDownloadLink}
                download
                className="inline-block bg-amber-700 text-white font-bold py-2 px-4 no-underline"
              >
                Download
              </a>
            )}
          </>
        )}
      </div>

      <a
        href="/"
        className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 no-underline"
      >
        ← Back
      </a>
    </div>
  );
}