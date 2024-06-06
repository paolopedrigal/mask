import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { ImageSource } from "expo-image";

export interface FriendsInterface {
  [key: string]: { username: string };
}

interface UserState {
  userID: string;
  userProfilePic: ImageSource;
  username: string;
  favColor: string;
  secondaryColor: string;
  friendsData: FriendsInterface;
  requestedFriendsData: FriendsInterface;
}

const initialState: UserState = {
  userID: "",
  userProfilePic: require("@assets/images/default-profile-pic.png"),
  username: "",
  favColor: "",
  secondaryColor: "",
  friendsData: {},
  requestedFriendsData: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserID: (state, action: PayloadAction<string>) => {
      state.userID = action.payload;
    },
    setUserProfilePic: (state, action: PayloadAction<ImageSource>) => {
      state.userProfilePic = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setFavColor: (state, action: PayloadAction<string>) => {
      state.favColor = action.payload;
    },
    setSecondaryColor: (state, action: PayloadAction<string>) => {
      state.secondaryColor = action.payload;
    },
    setFriendsData: (state, action: PayloadAction<FriendsInterface>) => {
      state.friendsData = action.payload;
    },
    setRequestedFriendsData: (
      state,
      action: PayloadAction<FriendsInterface>
    ) => {
      state.requestedFriendsData = action.payload;
    },
  },
});

// Export actions for authSlice
export const {
  setUserID,
  setUserProfilePic,
  setUsername,
  setFavColor,
  setSecondaryColor,
  setFriendsData,
  setRequestedFriendsData,
} = userSlice.actions;

// Export selectors for authSlice
export const selectUserID = (state: RootState) => state.user.userID;
export const selectUserProfilePic = (state: RootState) =>
  state.user.userProfilePic;
export const selectUsername = (state: RootState) => state.user.username;
export const selectFavColor = (state: RootState) => state.user.favColor;
export const selectSecondaryColor = (state: RootState) =>
  state.user.secondaryColor;
export const selectFriendsData = (state: RootState) => state.user.friendsData;
export const selectRequestedFriendIDs = (state: RootState) =>
  state.user.requestedFriendsData;

// Export authSlice's reducer
export default userSlice.reducer;
