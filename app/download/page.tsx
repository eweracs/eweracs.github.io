
import { Suspense } from 'react';
import { DownloadClient } from './client';

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  );
}

export default function DownloadPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DownloadClient />
    </Suspense>
  );
}