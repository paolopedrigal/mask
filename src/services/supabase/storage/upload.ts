import { supabase } from "../client";
import { decode } from "base64-arraybuffer";

export const uploadPicture = async (
  path: string,
  bucket: string,
  image: string
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, decode(image), {
      contentType: "image/jpeg",
      upsert: true, // Overwrite previous profile pic if exists
    });
  return { data, error };
};
