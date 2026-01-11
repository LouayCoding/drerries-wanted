-- Add media fields to wanted_persons table
ALTER TABLE wanted_persons 
ADD COLUMN IF NOT EXISTS media_urls TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS media_types TEXT[] DEFAULT '{}';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_wanted_persons_media ON wanted_persons USING GIN (media_urls);

-- Add comment for documentation
COMMENT ON COLUMN wanted_persons.media_urls IS 'Array of URLs to media files (images/videos) stored in Supabase Storage';
COMMENT ON COLUMN wanted_persons.media_types IS 'Array of media types corresponding to media_urls (image or video)';



