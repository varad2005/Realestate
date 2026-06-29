import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Globe, Move3D } from 'lucide-react';
import { VirtualTour } from '@/types';
import { VirtualTourViewer } from './VirtualTourViewer';
import { SceneSelector } from './SceneSelector';
import { virtualTourService } from '@/services/virtualTourService';

interface Dynamic360ModalProps {
  isOpen: boolean;
  onClose: () => void;
  tours: VirtualTour[];
  propertyName: string;
  propertyId: string;
}

export function Dynamic360Modal({
  isOpen,
  onClose,
  tours,
  propertyName,
  propertyId,
}: Dynamic360ModalProps) {
  const defaultTour = tours.find(t => t.is_default) || tours[0];
  const [activeScene, setActiveScene] = useState<VirtualTour>(defaultTour);
  const sessionId = useRef<string>(Math.random().toString(36).substring(2));
  const tracked = useRef<Set<string>>(new Set());

  // Reset active scene when tours change (e.g. new property opened)
  useEffect(() => {
    if (tours.length > 0) {
      setActiveScene(tours.find(t => t.is_default) || tours[0]);
    }
  }, [tours]);

  // ESC key closes modal
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    }
  }, [isOpen]);

  // Track tour open event once per open
  useEffect(() => {
    if (isOpen && tours.length > 0 && !tracked.current.has('open')) {
      tracked.current.add('open');
      virtualTourService.trackEvent(
        defaultTour?.id || null,
        propertyId,
        'tour_open',
        defaultTour?.title,
        sessionId.current
      );
    }
    if (!isOpen) {
      tracked.current.clear();
    }
  }, [isOpen]);

  const handleSceneChange = useCallback((scene: VirtualTour) => {
    setActiveScene(scene);
    virtualTourService.trackEvent(
      scene.id,
      propertyId,
      'scene_switch',
      scene.title,
      sessionId.current
    );
  }, [propertyId]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen || tours.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="360° Virtual Tour"
    >
      <div
        className="relative w-full max-w-5xl bg-[#0d0d1a] rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 animate-in slide-in-from-bottom-6 duration-400"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-violet-950/60 to-indigo-950/60">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-500/50 flex items-center justify-center shrink-0">
              <Globe size={15} className="text-violet-300" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-violet-400 uppercase tracking-widest">
                360° Virtual Tour
              </p>
              <p className="text-sm font-semibold text-white truncate leading-tight">
                {propertyName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Current scene name */}
            <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-xs font-semibold text-white/80 max-w-[160px] truncate">
                {activeScene.title}
              </span>
            </div>

            {/* Drag to explore badge */}
            <div className="hidden md:flex items-center gap-1.5 bg-violet-600/20 border border-violet-500/30 px-3 py-1.5 rounded-full">
              <Move3D size={13} className="text-violet-300" />
              <span className="text-[10px] font-bold text-violet-300 uppercase tracking-wide">
                Drag to Explore
              </span>
            </div>

            <button
              id="close-360-modal"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 flex items-center justify-center text-white/60 hover:text-white transition-all"
              aria-label="Close virtual tour"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Viewer */}
        <div className="p-4 pb-2">
          <VirtualTourViewer
            key={activeScene.id}
            tour={activeScene}
          />

          {/* Scene description */}
          {activeScene.description && (
            <p className="mt-3 text-sm text-gray-400 px-1 leading-relaxed">
              {activeScene.description}
            </p>
          )}
        </div>

        {/* Scene Selector */}
        <div className="px-4 pb-5">
          <SceneSelector
            scenes={tours}
            activeSceneId={activeScene.id}
            onSceneChange={handleSceneChange}
          />
        </div>

        {/* Footer tip */}
        <div className="px-6 py-3 border-t border-white/5 bg-black/30 flex items-center justify-between">
          <p className="text-[11px] text-gray-500">
            🖱️ Click & drag to look around · 🔍 Scroll to zoom · ⬛ Fullscreen button to expand
          </p>
          <p className="text-[11px] text-gray-600">
            {tours.indexOf(activeScene) + 1} / {tours.length}
          </p>
        </div>
      </div>
    </div>
  );
}
