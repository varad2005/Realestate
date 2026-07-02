import { useState, useMemo } from 'react';
import { PropertyImage, PropertyVideo, VirtualTour } from '@/types';
import { Maximize2, ChevronLeft, ChevronRight, X, PlayCircle, Camera, Video, Globe } from 'lucide-react';
import { getPropertyImage } from '@/utils/propertyImages';
import { VirtualTourViewer } from '@/components/Property360/VirtualTourViewer';

export function PropertyGallery({ 
  images, 
  videos, 
  virtualTours 
}: { 
  images: PropertyImage[], 
  videos?: PropertyVideo[],
  virtualTours?: VirtualTour[] 
}) {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos' | '360'>('photos');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeVirtualTourIndex, setActiveVirtualTourIndex] = useState(0);

  const hasPhotos = images && images.length > 0;
  const hasVideos = videos && videos.length > 0;
  const hasTours = virtualTours && virtualTours.length > 0;

  // Auto-correct tab if active tab becomes empty somehow
  useMemo(() => {
    if (activeTab === 'photos' && !hasPhotos) setActiveTab(hasVideos ? 'videos' : (hasTours ? '360' : 'photos'));
    if (activeTab === 'videos' && !hasVideos) setActiveTab(hasPhotos ? 'photos' : (hasTours ? '360' : 'photos'));
    if (activeTab === '360' && !hasTours) setActiveTab(hasPhotos ? 'photos' : (hasVideos ? 'videos' : 'photos'));
  }, [hasPhotos, hasVideos, hasTours, activeTab]);

  const activeMediaList = activeTab === 'photos' 
    ? (images || []).map(img => ({ type: 'image' as const, id: img.id, url: img.url, caption: img.caption }))
    : activeTab === 'videos'
      ? (videos || []).map(vid => ({ type: 'video' as const, id: vid.id, url: vid.video_url, thumbnail: vid.thumbnail_url || getPropertyImage(vid.id), caption: vid.title || 'Property Video' }))
      : [];

  const activeMedia = activeMediaList[activeIndex];
  const activeTour = virtualTours?.[activeVirtualTourIndex];

  if (!hasPhotos && !hasVideos && !hasTours) return null;

  const nextMedia = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === activeMediaList.length - 1 ? 0 : prev + 1));
  };

  const prevMedia = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? activeMediaList.length - 1 : prev - 1));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex gap-2 bg-gray-50 p-1.5 rounded-xl w-max max-w-full overflow-x-auto hide-scrollbar">
        {hasPhotos && (
          <button 
            onClick={() => { setActiveTab('photos'); setActiveIndex(0); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'photos' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Camera size={16} />
            Photos ({images.length})
          </button>
        )}
        {hasVideos && (
          <button 
            onClick={() => { setActiveTab('videos'); setActiveIndex(0); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'videos' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Video size={16} />
            Videos ({videos.length})
          </button>
        )}
        {hasTours && (
          <button 
            onClick={() => setActiveTab('360')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === '360' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Globe size={16} />
            360° Tour
          </button>
        )}
      </div>

      <div className="relative rounded-2xl overflow-hidden bg-gray-50 group">
        
        {/* Render 360 Tour */}
        {activeTab === '360' && activeTour ? (
          <div className="w-full bg-black flex flex-col">
            <VirtualTourViewer tour={activeTour} />
            {/* 360 Thumbnails */}
            {virtualTours && virtualTours.length > 1 && (
              <div className="flex gap-2 p-3 bg-gray-900 overflow-x-auto hide-scrollbar">
                {virtualTours.map((tour, idx) => (
                  <button 
                    key={tour.id}
                    onClick={() => setActiveVirtualTourIndex(idx)}
                    className={`relative h-16 w-24 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeVirtualTourIndex === idx ? 'border-pink-600' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img 
                      src={tour.thumbnail_url || getPropertyImage(tour.id)} 
                      onError={(e) => { e.currentTarget.src = getPropertyImage(tour.id); }}
                      className="w-full h-full object-cover" 
                      alt={tour.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <span className="absolute bottom-1 left-1 right-1 text-[10px] text-white font-medium truncate text-center">
                      {tour.title}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Render Photos / Videos */
          activeMedia && (
            <>
              <div 
                className="aspect-video w-full relative cursor-pointer bg-black flex items-center justify-center"
                onClick={() => {
                  if (activeMedia.type === 'image') {
                    setIsFullscreen(true);
                  }
                }}
              >
                {activeMedia.type === 'video' ? (
                  <video 
                    src={activeMedia.url} 
                    poster={activeMedia.thumbnail}
                    controls 
                    controlsList="nodownload"
                    className="w-full h-full object-contain"
                  >
                    Your browser does not support HTML5 video.
                  </video>
                ) : (
                  <>
                    <img 
                      src={activeMedia.url} 
                      alt={activeMedia.caption || "Property View"}
                      onError={(e) => { e.currentTarget.src = getPropertyImage(activeMedia.id || Math.random().toString()); }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    
                    <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors opacity-0 group-hover:opacity-100">
                      <Maximize2 size={18} />
                    </button>
                  </>
                )}
                
                <div className="absolute bottom-4 left-4 text-white font-medium text-sm drop-shadow-md z-10 pointer-events-none">
                  {activeMedia.caption && <p className="bg-black/40 px-2 py-1 rounded">{activeMedia.caption}</p>}
                </div>

                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest z-10 pointer-events-none">
                  {activeIndex + 1} / {activeMediaList.length}
                </div>
              </div>

              {/* Thumbnail Navigation for Photos/Videos */}
              {activeMediaList.length > 1 && (
                <div className="flex gap-2 p-2 bg-white overflow-x-auto hide-scrollbar border-t border-gray-200">
                  {activeMediaList.map((item, idx) => (
                    <button 
                      key={item.id}
                      onClick={() => setActiveIndex(idx)}
                      className={`relative h-16 w-24 shrink-0 rounded-lg overflow-hidden border-2 transition-all group ${activeIndex === idx ? 'border-pink-600' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img 
                        src={item.type === 'video' ? item.thumbnail : item.url} 
                        onError={(e) => { e.currentTarget.src = getPropertyImage(item.id || Math.random().toString()); }}
                        className="w-full h-full object-cover" 
                      />
                      {item.type === 'video' && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <PlayCircle size={20} className="text-white opacity-80" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </>
          )
        )}
      </div>

      {/* Fullscreen Viewer */}
      {isFullscreen && activeMedia?.type === 'image' && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-lg flex items-center justify-center">
          <button 
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
          >
            <X size={32} />
          </button>

          {activeMediaList.length > 1 && (
            <button onClick={prevMedia} className="absolute left-6 text-white/50 hover:text-white transition-colors p-4">
              <ChevronLeft size={48} />
            </button>
          )}

          <img 
            src={activeMedia.url}
            onError={(e) => { e.currentTarget.src = getPropertyImage(activeMedia.id || Math.random().toString()); }}
            className="max-h-[85vh] max-w-[85vw] object-contain rounded-xl shadow-2xl"
          />

          {activeMediaList.length > 1 && (
            <button onClick={nextMedia} className="absolute right-6 text-white/50 hover:text-white transition-colors p-4 z-50">
              <ChevronRight size={48} />
            </button>
          )}

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 font-medium z-50">
            {activeIndex + 1} of {activeMediaList.length} {activeMedia.caption ? `• ${activeMedia.caption}` : ''}
          </div>
        </div>
      )}
    </div>
  );
}
