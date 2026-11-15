-- ============================================================
-- Storage for spot photos.
--
-- The bucket is public, which means reads go through
--   <project>/storage/v1/object/public/spot-photos/<path>
-- and skip RLS entirely. That is what lets expo-image cache a photo on the
-- device instead of re-signing a URL on every render.
--
-- Photos must be ones we own or that are openly licensed. Google Places and
-- Street View both forbid storing their image bytes, so they cannot go here.
--
-- Layout:
--   seed/<spot id>/<n>.jpg   curated photos, uploaded by us (see SETUP.md)
--   uploads/<user id>/...    reserved for photos attached to a rating; needs
--                            an insert policy before the app can write here
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'spot-photos',
  'spot-photos',
  true,
  5242880, -- 5 MB; campus photos should be resized well under this
  array['image/jpeg', 'image/webp', 'image/png']
)
on conflict (id) do nothing;
