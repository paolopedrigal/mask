import { supabase } from "../client";

export const updateUsername = async (userID: string, newUsername: string) => {
  const { data, error } = await supabase
    .from("users")
    .update({ username: newUsername })
    .eq("user_id", userID)
    .select();
  return { data, error };
};

export const upsertHandsData = async (handsData: {
  user_id: string;
  1: string | null;
  2: string | null;
  3: string | null;
  4: string | null;
  5: string | null;
  6: string | null;
  7: string | null;
}) => {
  const { data, error } = await supabase
    .from("hands")
    .upsert(handsData)
    .select();
  return { data, error };
};
