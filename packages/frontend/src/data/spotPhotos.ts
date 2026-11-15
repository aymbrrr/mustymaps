/**
 * Resolves paths in the spot-photos storage bucket to absolute URLs.
 *
 * Seed photos live at seed/<spot id>/<n>.jpg. Adding one is an upload plus a
 * spotPhotoUrl() call in the spot's `photos` array — see SETUP.md.
 */
import { supabase } from '../lib/supabase';

export const SPOT_PHOTO_BUCKET = 'spot-photos';

/** 'seed/klib/1.jpg' -> 'https://<ref>.supabase.co/storage/v1/object/public/spot-photos/seed/klib/1.jpg' */
export function spotPhotoUrl(path: string): string {
  return supabase.storage.from(SPOT_PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
}
