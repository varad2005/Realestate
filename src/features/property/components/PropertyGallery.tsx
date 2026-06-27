import { useState } from 'react';
import { PropertyImage, PropertyVideo } from '@/types';
import { Maximize2, ChevronLeft, ChevronRight, X, PlayCircle } from 'lucide-react';
import { getPropertyImage } from '@/utils/propertyImages';

export function PropertyGallery({ images, videos }: { images: PropertyImage[], videos?: PropertyVideo[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const mediaItems: Array<{ type: 'image' | 'video'; id: string; url: string; caption?: string; thumbnail?: string }> = [
    ...(images || []).map(img => ({ type: 'image' as const, id: img.id, url: img.url, caption: img.caption })),
    ...(videos || []).map(vid => ({ type: 'video' as const, id: vid.id, url: vid.video_url, thumbnail: vid.thumbnail_url || getPropertyImage(vid.id), caption: vid.title || 'Property Video' }))
  ];

  if (mediaItems.length === 0) return null;

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  const activeMedia = mediaItems[activeIndex];

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden bg-gray-100 group">
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
            {activeIndex + 1} / {mediaItems.length}
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="flex gap-2 p-2 bg-white overflow-x-auto hide-scrollbar border-t border-gray-100">
          {mediaItems.map((item, idx) => (
            <button 
              key={item.id}
              onClick={() => setActiveIndex(idx)}
              className={`relative h-16 w-24 shrink-0 rounded-lg overflow-hidden border-2 transition-all group ${activeIndex === idx ? 'border-[#FF3F6C]' : 'border-transparent opacity-60 hover:opacity-100'}`}
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
      </div>

      {/* Fullscreen Viewer */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-lg flex items-center justify-center">
          <button 
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
          >
            <X size={32} />
          </button>

          <button onClick={prevImage} className="absolute left-6 text-white/50 hover:text-white transition-colors p-4">
            <ChevronLeft size={48} />
          </button>

          <img 
            src={activeMedia.type === 'image' ? activeMedia.url : ''}
            onError={(e) => { e.currentTarget.src = getPropertyImage(activeMedia.id || Math.random().toString()); }}
            className="max-h-[85vh] max-w-[85vw] object-contain rounded-xl shadow-2xl"
          />

          <button onClick={nextImage} className="absolute right-6 text-white/50 hover:text-white transition-colors p-4 z-50">
            <ChevronRight size={48} />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 font-medium z-50">
            {activeIndex + 1} of {mediaItems.length} • {activeMedia.caption}
          </div>
        </div>
      )}
    </>
  );
}
