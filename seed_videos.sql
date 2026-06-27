-- Update the dummy videos to use an actual real estate property video instead of Big Buck Bunny
UPDATE public.property_videos
SET video_url = 'https://assets.mixkit.co/videos/preview/mixkit-modern-suburban-house-4131-large.mp4'
WHERE video_url = 'https://www.w3schools.com/html/mov_bbb.mp4';

-- Ensure any newly inserted videos from the fallback query also use this video
INSERT INTO public.property_videos (
    property_id,
    video_url,
    thumbnail_url,
    title,
    duration_seconds,
    file_size_mb,
    is_primary,
    sort_order
)
SELECT 
    p.id,
    'https://assets.mixkit.co/videos/preview/mixkit-modern-suburban-house-4131-large.mp4',
    'https://loremflickr.com/800/600/house,interior,realestate?random=' || p.id,
    'Property Walkthrough Tour',
    10,
    1.5,
    true,
    0
FROM public.properties p
WHERE NOT EXISTS (
    SELECT 1 FROM public.property_videos pv WHERE pv.property_id = p.id
);

-- Notify postgREST to reload the schema cache
NOTIFY pgrst, 'reload schema';
