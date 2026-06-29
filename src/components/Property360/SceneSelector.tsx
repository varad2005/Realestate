import { VirtualTour } from '@/types';

interface SceneSelectorProps {
  scenes: VirtualTour[];
  activeSceneId: string;
  onSceneChange: (scene: VirtualTour) => void;
}

export function SceneSelector({ scenes, activeSceneId, onSceneChange }: SceneSelectorProps) {
  if (scenes.length <= 1) return null;

  return (
    <div className="mt-4">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">
        Select a Room
      </p>
      <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory">
        {scenes.map((scene) => {
          const isActive = scene.id === activeSceneId;
          return (
            <button
              key={scene.id}
              onClick={() => onSceneChange(scene)}
              className={`flex-shrink-0 snap-start group flex flex-col items-center gap-2 transition-all duration-200 ${
                isActive ? 'scale-105' : 'opacity-60 hover:opacity-90 hover:scale-[1.03]'
              }`}
            >
              {/* Thumbnail */}
              <div
                className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all shadow-lg ${
                  isActive
                    ? 'border-violet-500 shadow-violet-500/30'
                    : 'border-white/10 group-hover:border-white/30'
                }`}
              >
                {scene.thumbnail_url ? (
                  <img
                    src={scene.thumbnail_url}
                    alt={scene.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-900 to-indigo-900 flex items-center justify-center">
                    <span className="text-2xl">🌐</span>
                  </div>
                )}

                {/* Active overlay */}
                {isActive && (
                  <div className="absolute inset-0 bg-violet-500/20 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-violet-400 border-2 border-white shadow" />
                  </div>
                )}
              </div>

              {/* Scene name */}
              <span
                className={`text-[11px] font-semibold text-center max-w-[96px] leading-tight truncate ${
                  isActive ? 'text-violet-300' : 'text-gray-400'
                }`}
              >
                {scene.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
