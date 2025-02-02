import { createSupabaseClient } from "../supabase/client";
import { Post } from "../types";

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
    const { error } = await supabase.storage
      .from("image_uploads")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Image upload failed:", error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("image_uploads")
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
  const { data, error } = await supabase.from("memories2").select("*");
  if (error) throw new Error("Failed to fetch memories");
  return data;
};

export const subscribeToMemories = (callback: (memory: Post) => void) => {
  const subscription = supabase
    .channel("memories2_changes")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "memories2" },
      (payload) => callback(payload.new as Post)
    )
    .subscribe();

  return () => subscription.unsubscribe();
};
