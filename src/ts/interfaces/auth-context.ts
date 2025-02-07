export interface AuthContextStates {
  signInUpScreen: number;
  isSignUpState: boolean;
  email: string;
  name: string;
  birthday: string;
  isTyped: boolean;
  isSubmitted: boolean;
  isCreateUserError: boolean;
  isPush: boolean;

  incrementSignInUpScreen: () => void;
  decrementSignInUpScreen: () => void;
  setIsSignUpState: (booleanValue: boolean) => void;
  setEmail: (text: string) => void;
  setName: (text: string) => void;
  setBirthday: (text: string) => void;
  setIsTyped: (booleanValue: boolean) => void;
  setIsSubmitted: (booleanValue: boolean) => void;
  setIsCreateUserError: (booleanValue: boolean) => void;
  setIsPush: (booleanValue: boolean) => void;
}
