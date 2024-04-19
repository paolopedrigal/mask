import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface UserState {
  userID: string;
  name: string;
  username: string;
  favColor: string;
  secondaryColor: string;
}

const initialState: UserState = {
  userID: "",
  name: "",
  username: "",
  favColor: "",
  secondaryColor: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserID: (state, action: PayloadAction<string>) => {
      state.userID = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
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
  },
});

// Export actions for authSlice
export const {
  setUserID,
  setName,
  setUsername,
  setFavColor,
  setSecondaryColor,
} = userSlice.actions;

// Export selectors for authSlice
export const selectUserID = (state: RootState) => state.user.userID;
export const selectName = (state: RootState) => state.user.name;
export const selectUsername = (state: RootState) => state.user.username;
export const selectFavColor = (state: RootState) => state.user.favColor;
export const selectSecondaryColor = (state: RootState) =>
  state.user.secondaryColor;

// Export authSlice's reducer
export default userSlice.reducer;
