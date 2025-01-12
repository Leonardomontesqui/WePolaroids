import { createSupabaseClient } from "./supabase/client";

interface Data_Post {
  title: string;
  description: string;
  tags: string[];
  image: string;
  location: [number, number];
}
const supabase = createSupabaseClient();

export const uploadImage = async (file: File) => {
  const fileName = `${Date.now()}-${file.name}`;
  const { data: bird, error } = await supabase.storage
    .from("image_uploads") // Replace with your Supabase bucket name
    .upload(fileName, file);

  if (error) {
    console.error("Image upload failed:", error.message);
    return null;
  }

  // Return the public URL
  const { data } = supabase.storage
    .from("your-bucket-name")
    .getPublicUrl(fileName);

  return data?.publicUrl;
};

export const createPost = async (postData: Data_Post) => {
  const { data, error } = await supabase
    .from("memories")
    .insert(postData)
    .select();

  if (error) {
    console.error("Error inserting post:", error.message);
  }
  return;
};
