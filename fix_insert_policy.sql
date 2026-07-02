-- Fix INSERT policy
DROP POLICY IF EXISTS "Auth Insert property_images" ON storage.objects;
CREATE POLICY "Auth Insert property_images" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'property_images');
