import { useState, Suspense } from 'react';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { VirtualTour } from '@/types';

// Dynamically import Pannellum to avoid loading it at page start
let PannellumComponent: any = null;

const PANNELLUM_VERSION = "2.5.6";
const JS_URL = `https://cdn.jsdelivr.net/npm/pannellum@${PANNELLUM_VERSION}/build/pannellum.js`;
const CSS_URL = `https://cdn.jsdelivr.net/npm/pannellum@${PANNELLUM_VERSION}/build/pannellum.css`;

function loadPannellumCDN(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).pannellum) {
      resolve();
      return;
    }

    if (document.querySelector(`script[src="${JS_URL}"]`)) {
      const interval = setInterval(() => {
        if ((window as any).pannellum) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = CSS_URL;
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = JS_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Pannellum CDN'));
    document.head.appendChild(script);
  });
}

async function loadPannellum() {
  await loadPannellumCDN();
  if (!PannellumComponent) {
    // @ts-ignore
    const mod = await import('pannellum-react');
    PannellumComponent = mod.Pannellum;
  }
  return PannellumComponent;
}

interface VirtualTourViewerProps {
  tour: VirtualTour;
  onLoad?: () => void;
}

export function VirtualTourViewer({ tour, onLoad }: VirtualTourViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [PannellumLoaded, setPannellumLoaded] = useState<any>(null);
  const [key, setKey] = useState(0);

  // Load Pannellum on mount
  useState(() => {
    loadPannellum().then(P => {
      setPannellumLoaded(() => P);
    }).catch(() => {
      setError('Failed to load 360° viewer');
      setLoading(false);
    });
  });

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setKey(k => k + 1);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[320px] md:h-[420px] lg:h-[500px] bg-gray-900 rounded-xl text-white gap-4">
        <AlertTriangle size={40} className="text-yellow-500" />
        <p className="text-sm font-medium text-gray-500/50">{error}</p>
        <button
          onClick={handleRetry}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <RefreshCw size={14} />
          Retry
        </button>
      </div>
    );
  }

  if (!PannellumLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-[320px] md:h-[420px] lg:h-[500px] bg-gray-900 rounded-xl text-white gap-3">
        <Loader2 size={36} className="animate-spin text-purple-600" />
        <p className="text-sm font-medium text-gray-500">Initialising viewer…</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[320px] md:h-[420px] lg:h-[500px] rounded-xl overflow-hidden bg-gray-900">
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900 text-white gap-3">
          <Loader2 size={36} className="animate-spin text-purple-600" />
          <p className="text-sm font-medium text-gray-500 animate-pulse">Loading panorama…</p>
        </div>
      )}

      <PannellumLoaded
        key={`${tour.id}-${key}`}
        width="100%"
        height="100%"
        image={tour.panorama_url}
        pitch={10}
        yaw={180}
        hfov={110}
        autoLoad
        showControls
        showFullscreenCtrl
        showZoomCtrl
        compass
        mouseZoom
        draggable
        onLoad={() => {
          setLoading(false);
          onLoad?.();
        }}
        onError={(err: string) => {
          console.error('Pannellum error:', err);
          setError('Unable to load this panorama. The image may be unavailable.');
          setLoading(false);
        }}
      />
    </div>
  );
}
