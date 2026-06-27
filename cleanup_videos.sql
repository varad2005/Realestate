-- Clean up all dummy videos from the database
DELETE FROM public.property_videos
WHERE video_url IN (
    'https://www.w3schools.com/html/mov_bbb.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-modern-suburban-house-4131-large.mp4'
);

-- Notify postgREST to reload the schema cache
NOTIFY pgrst, 'reload schema';
