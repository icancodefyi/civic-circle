-- Add image column to reports table to store base64 encoded images
ALTER TABLE reports 
ADD COLUMN image LONGTEXT;