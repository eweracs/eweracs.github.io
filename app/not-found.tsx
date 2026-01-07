import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen w-screen overflow-hidden bg-black">
      <div className="min-h-screen flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-lg">
            <div className="absolute inset-0 bg-white/5 pointer-events-none" />

            <div className="relative px-12 py-20 text-white">
              <h1 className="mt-2 text-white normal text-2xl">Page not found</h1>

              <p className="mt-4 text-white/80">
                The page you’re looking for doesn’t exist (or has moved).
              </p>

              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-flex justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors
                  backdrop-blur-sm px-5 py-2 text-white font-semibold tracking-wide
                  [font-variation-settings:'wght'_500] hover:[font-variation-settings:'wght'_700] no-underline"
                >
                  ← Back
                </Link>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}