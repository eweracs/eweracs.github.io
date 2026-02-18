'use client';

import Script from 'next/script';
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
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_SHORTENER_API_BASE?.replace(/\/$/, '');
  const telegramWorkerBase = process.env.NEXT_PUBLIC_TELEGRAM_WORKER_URL?.replace(/\/$/, '');
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    (window as typeof window & {
      onTurnstileSuccess?: (token: string) => void;
      onTurnstileError?: () => void;
      onTurnstileExpired?: () => void;
    }).onTurnstileSuccess = (token: string) => {
      setTurnstileToken(token);
      setTurnstileError(null);
    };

    (window as typeof window & {
      onTurnstileError?: () => void;
    }).onTurnstileError = () => {
      setTurnstileError('Verification failed. Please try again.');
    };

    (window as typeof window & {
      onTurnstileExpired?: () => void;
    }).onTurnstileExpired = () => {
      setTurnstileToken(null);
    };
  }, []);

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

      if (!turnstileSiteKey) {
        setError('Verification is not configured.');
        return;
      }

      if (!turnstileToken) {
        setTurnstileError('Please complete the verification.');
        return;
      }

      await fetch(`${telegramWorkerBase}/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          fileName,
          turnstileToken,
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
            {turnstileSiteKey && (
              <>
                <div className="mb-4">
                  <div
                    className="cf-turnstile"
                    data-sitekey={turnstileSiteKey}
                    data-callback="onTurnstileSuccess"
                    data-error-callback="onTurnstileError"
                    data-expired-callback="onTurnstileExpired"
                    data-theme="dark"
                  />
                </div>
                <Script
                  src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                  strategy="afterInteractive"
                />
              </>
            )}
            {turnstileError && (
              <p className="text-white mb-4">{turnstileError}</p>
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
