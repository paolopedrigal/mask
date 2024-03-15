import { createContext, ReactNode, useState } from "react";

export const AuthContext = createContext<AuthContextStates | null>(null);

type AuthProviderChildren = {
  children: ReactNode;
};

export interface AuthContextStates {
  signInUpScreen: number;
  isSignUpState: boolean;
  email: string;
  name: string;
  birthday: string;
  isTyped: boolean;
  isSubmitted: boolean;
  isUserCreated: boolean;
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
  setIsUserCreated: (booleanValue: boolean) => void;
  setIsCreateUserError: (booleanValue: boolean) => void;
  setIsPush: (booleanValue: boolean) => void;
}

export default function AuthProvider({ children }: AuthProviderChildren) {
  const [signInUpScreen, setSignInUpScreen] = useState<number>(1);
  const [isSignUpState, setIsSignUpState] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [birthday, setBirthday] = useState<string>(""); // TODO: Possibly change to number
  const [isTyped, setIsTyped] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isUserCreated, setIsUserCreated] = useState<boolean>(false);
  const [isCreateUserError, setIsCreateUserError] = useState<boolean>(false);
  const [isPush, setIsPush] = useState<boolean>(true);

  const incrementSignInUpScreen = () => setSignInUpScreen((prev) => prev + 1);
  const decrementSignInUpScreen = () => setSignInUpScreen((prev) => prev - 1);

  return (
    <AuthContext.Provider
      value={{
        signInUpScreen,
        incrementSignInUpScreen,
        decrementSignInUpScreen,
        isSignUpState,
        setIsSignUpState,
        email,
        setEmail,
        name,
        setName,
        birthday,
        setBirthday,
        isTyped,
        setIsTyped,
        isSubmitted,
        setIsSubmitted,
        isUserCreated,
        setIsUserCreated,
        isCreateUserError,
        setIsCreateUserError,
        isPush,
        setIsPush,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
