import { createSupabaseClient } from "./supabase/client";

interface Data_Post {
  title: string;
  description: string;
  tags: string[];
  image_url: string;
  location: [number, number];
}
const supabase = createSupabaseClient();

export const uploadImage = async (file: File) => {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("image_uploads") // Make sure this bucket exists in your Supabase
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Image upload failed:", error.message);
      return null;
    }

    // Get the public URL using the same bucket name
    const { data: publicUrlData } = supabase.storage
      .from("image_uploads") // Use the same bucket name here
      .getPublicUrl(fileName);

    return publicUrlData?.publicUrl;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
};

export const createPost = async (postData: Data_Post) => {
  const { data, error } = await supabase
    .from("memories2")
    .insert(postData)
    .select();
  console.log(data);

  if (error) {
    console.error("Error inserting post:", error.message);
  }
  return;
};

export const fetchPosts = async () => {
  const { data, error } = await supabase.from("memories2").select();
  if (error) {
    console.error("Error fetching posts:", error.message);
    return null;
  }
  return data;
};
