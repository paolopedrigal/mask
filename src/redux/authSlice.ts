import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface AuthState {
  signInUpScreen: number;
  email: string;
  name: string;
  birthday: string;
  isTyped: boolean;
  isSubmit: boolean;
}

const initialState: AuthState = {
  signInUpScreen: 1,
  email: "",
  name: "",
  birthday: "",
  isTyped: false,
  isSubmit: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    incrementSignInUpScreen: (state) => {
      state.signInUpScreen += 1;
    },
    decrementSignInUpScreen: (state) => {
      state.signInUpScreen -= 1;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setBirthday: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setTyped: (state, action: PayloadAction<boolean>) => {
      state.isTyped = action.payload;
    },
    setSubmit: (state, action: PayloadAction<boolean>) => {
      state.isSubmit = action.payload;
    },
  },
});

// Export actions for authSlice
export const {
  incrementSignInUpScreen,
  decrementSignInUpScreen,
  setEmail,
  setName,
  setBirthday,
  setTyped,
  setSubmit,
} = authSlice.actions;

// Export selectors for authSlice
export const selectSignInUpScreen = (state: RootState) =>
  state.auth.signInUpScreen;
export const selectEmail = (state: RootState) => state.auth.email;
export const selectName = (state: RootState) => state.auth.name;
export const selectBirthday = (state: RootState) => state.auth.birthday;
export const selectIsTyped = (state: RootState) => state.auth.isTyped;
export const selectIsSubmit = (state: RootState) => state.auth.isSubmit;

// Export authSlice's reducer
export default authSlice.reducer;
