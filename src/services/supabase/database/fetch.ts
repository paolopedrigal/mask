import {
  FetchDeck,
  FriendsDataInterface,
  InboxQuery,
} from "@ts/interfaces/supabase";
import { supabase } from "../client";

export async function fetchDeckFromDatabase(deckID: string) {
  const { data, error } = await supabase
    .from("replies")
    .select(
      `
        is_main,
        card_id (
        card_id,
        author_id (
            user_id,
            username,
            fav_color
        ),
        text,
        image_url
        ),
        deck_id (
        view_mutuals,
        is_looping
        )
    `
    )
    .eq("deck_id", deckID)
    .returns<FetchDeck[]>();
  return { data, error };
}

export async function fetchMainUserData(userID: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userID);
  return { data, error };
}

export async function fetchMainUserFriendsData(userID: string) {
  const { data, error } = await supabase
    .from("friends")
    .select("friend_id (user_id, username), is_friends, requested")
    .eq("user_id", userID)
    .returns<FriendsDataInterface[]>();
  return { data, error };
}

export async function fetchInboxData(userID: string) {
  const { data, error } = await supabase
    .from("inbox")
    .select(
      `
        deck_id,
        viewed,
        main_card_id (
          text,
          image_url
        ),
        sender_id (
          user_id,
          username,
          fav_color
        )
      `
    )
    .eq("recipient_id", userID)
    .returns<InboxQuery[]>();
  return { data, error };
}

export async function fetchHands(userID: string) {
  const { data, error } = await supabase
    .from("hands")
    .select()
    .eq("user_id", userID);
  return { data, error };
}
