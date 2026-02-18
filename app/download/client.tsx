'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type ShortLookupResponse = {
  driveId?: string;
  name?: string;
};

export function DownloadClient() {
  const searchParams = useSearchParams();
  const [fileName, setFileName] = useState('Download File');
  const [fileId, setFileId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [hasStartedDownload, setHasStartedDownload] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_SHORTENER_API_BASE?.replace(/\/$/, '');
  const telegramWorkerBase = process.env.NEXT_PUBLIC_TELEGRAM_WORKER_URL?.replace(/\/$/, '');

  const resolveShortId = async (shortId: string) => {
    if (!apiBase) {
      setError('Short links are not configured.');
      return;
    }

    setIsResolving(true);
    setError(null);

    try {
      const response = await fetch(`${apiBase}/resolve/${encodeURIComponent(shortId)}`);

      if (!response.ok) {
        throw new Error(`Resolve failed with status ${response.status}`);
      }

      const data = (await response.json()) as ShortLookupResponse;
      const resolvedId = data.driveId?.trim();

      if (!resolvedId) {
        setError('Short link not found.');
        return;
      }

      setFileId(resolvedId);
      setFileName(data.name?.trim() || 'Download File');
    } catch (err) {
      console.error('Short link resolve failed', err);
      setError('Short link lookup failed.');
    } finally {
      setIsResolving(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const id = params.get('id');
    const name = params.get('name') || 'Download File';
    const short = params.get('short');
    const bareKey = !id && !short && !params.get('name')
      ? params.keys().next().value
      : null;

    if (!id) {
      if (short || bareKey) {
        void resolveShortId((short || bareKey) as string);
      } else {
        setError('No file ID provided.');
      }
      return;
    }

    setFileId(id);
    setFileName(name);
  }, [searchParams]);

  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    setHasStartedDownload(true);

    try {
      if (!telegramWorkerBase) {
        setError('Download notifications are not configured.');
        return;
      }

      await fetch(`${telegramWorkerBase}/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          fileName,
        }),
      });
    } catch (err) {
      console.error('Notification failed', err);
    }
  };

  const driveDownloadLink = fileId
    ? `https://drive.google.com/uc?id=${fileId}&export=download`
    : null;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-6">
      <div className="bg-blue-900 shadow-lg p-8 max-w-md w-full relative overflow-hidden">
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
            {isResolving && !driveDownloadLink && (
              <p className="text-white mb-4">Resolving short link...</p>
            )}
            {driveDownloadLink && (
              <a
                id="download-button"
                href={driveDownloadLink}
                onClick={handleDownload}
                className="inline-block bg-amber-700 text-white font-bold py-2 px-4 no-underline"
              >
                {isResolving ? 'Resolving…' : 'Download'}
              </a>
            )}
          </>
        )}
        {hasStartedDownload && (
          <div className="absolute inset-0 bg-emerald-800 text-white flex flex-col items-center justify-center text-center px-6 download-overlay">
            <p className="text-xl font-bold mb-2">Download started</p>
            <p>This may take a moment.</p>
          </div>
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
