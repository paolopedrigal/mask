import { createContext, ReactNode, useState } from "react";

export const AuthContext = createContext<AuthContextStates | null>(null);

type AuthProviderChildren = {
  children: ReactNode;
};

export interface AuthContextStates {
  email: string;
  name: string;
  birthday: string;
  isTyped: boolean;
  isSubmitted: boolean;
  isSignedUp: boolean;
  isCreateUserError: boolean;

  setEmail: (text: string) => void;
  setName: (text: string) => void;
  setBirthday: (text: string) => void;
  setIsTyped: (booleanValue: boolean) => void;
  setIsSubmitted: (booleanValue: boolean) => void;
  setIsSignedUp: (booleanValue: boolean) => void;
  setIsCreateUserError: (booleanValue: boolean) => void;
}

export default function AuthProvider({ children }: AuthProviderChildren) {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [birthday, setBirthday] = useState<string>(""); // TODO: Possibly change to number
  const [isTyped, setIsTyped] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSignedUp, setIsSignedUp] = useState<boolean>(false);
  const [isCreateUserError, setIsCreateUserError] = useState<boolean>(false);

  return (
    <AuthContext.Provider
      value={{
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
        isSignedUp,
        setIsSignedUp,
        isCreateUserError,
        setIsCreateUserError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
