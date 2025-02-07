import { AuthContextStates } from "@ts/interfaces/auth-context";
import { createContext, ReactNode, useState } from "react";

export const AuthContext = createContext<AuthContextStates | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [signInUpScreen, setSignInUpScreen] = useState<number>(1);
  const [isSignUpState, setIsSignUpState] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [birthday, setBirthday] = useState<string>(""); // TODO: Possibly change to number
  const [isTyped, setIsTyped] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
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
