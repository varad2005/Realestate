import { useState, Suspense } from 'react';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { VirtualTour } from '@/types';

// Dynamically import Pannellum to avoid loading it at page start
let PannellumComponent: any = null;

async function loadPannellum() {
  if (!PannellumComponent) {
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
        <AlertTriangle size={40} className="text-amber-400" />
        <p className="text-sm font-medium text-gray-300">{error}</p>
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
        <Loader2 size={36} className="animate-spin text-violet-400" />
        <p className="text-sm font-medium text-gray-400">Initialising viewer…</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[320px] md:h-[420px] lg:h-[500px] rounded-xl overflow-hidden bg-gray-900">
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900 text-white gap-3">
          <Loader2 size={36} className="animate-spin text-violet-400" />
          <p className="text-sm font-medium text-gray-400 animate-pulse">Loading panorama…</p>
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
