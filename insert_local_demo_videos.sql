-- Insert a local demo property video for all properties
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
    '/demo-property.mp4',
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
