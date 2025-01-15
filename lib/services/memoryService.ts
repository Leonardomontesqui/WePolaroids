import { createSupabaseClient } from "@/lib/supabase/client";

const supabase = createSupabaseClient();

export const fetchMemories = async () => {
  const { data, error } = await supabase.from("memories2").select("*");
  if (error) throw new Error("Failed to fetch memories");
  return data;
};

export const subscribeToMemories = (
  callback: (arg0: { [key: string]: any }) => void
) => {
  const subscription = supabase
    .channel("memories2_changes")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "memories2" },
      (payload) => callback(payload.new)
    )
    .subscribe();

  return () => subscription.unsubscribe();
};
