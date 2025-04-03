export interface FetchDeck {
  is_main: boolean;
  card_id: {
    card_id: string;
    author_id: {
      user_id: string;
      username: string;
      fav_color: string;
    };
    text: string | null;
    image_url: string | null;
  };
  deck_id: {
    view_mutuals: boolean;
    is_looping: boolean;
  };
}

export interface FriendsDataInterface {
  friend_id: { user_id: string; username: string };
  is_friends: boolean;
  requested: boolean;
}

export interface InboxQuery {
  deck_id: string;
  viewed: boolean;
  main_card_id: { text: string | null; image_url: string | null };
  sender_id: { user_id: string; username: string; fav_color: string };
}
