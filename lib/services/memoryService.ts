import { createSupabaseClient } from "@/lib/supabase/client";
import { Post } from "../types";

const supabase = createSupabaseClient();

export const fetchMemories = async () => {
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
