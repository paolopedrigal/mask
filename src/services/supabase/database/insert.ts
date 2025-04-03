import { supabase } from "../client";

export async function insertDeck(deckData: {
  view_mutuals: boolean;
  is_looping: boolean;
}) {
  const { data, error } = await supabase
    .from("decks")
    .insert(deckData)
    .select("deck_id");
  return { data, error };
}

export async function insertCard(cardData: {
  author_id: string;
  text: string | undefined;
  image_url: string;
}) {
  const { data, error } = await supabase
    .from("cards")
    .insert(cardData)
    .select("card_id");
  return { data, error };
}

export async function insertReply(replyData: {
  card_id: string;
  deck_id: string;
  is_main: boolean;
}) {
  const { data, error } = await supabase.from("replies").insert(replyData);
  return { data, error };
}

export async function insertInbox(
  inboxData: (
    | {
        recipient_id: string;
        sender_id: string;
        main_card_id: any;
        deck_id: any;
      }
    | undefined
  )[]
) {
  const { data, error } = await supabase.from("inbox").insert(inboxData);
  return { data, error };
}
