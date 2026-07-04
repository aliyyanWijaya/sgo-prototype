import { auth } from "@/config/firebase";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleAuthProvider,
  User,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInAnonymously,
  signInWithCredential,
} from "firebase/auth";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Required so the browser popup/redirect closes properly after Google login
WebBrowser.maybeCompleteAuthSession();

interface AuthContextValue {
  user: User | null;
  loaded: boolean;
  /** true if the current user is signed in anonymously (Guest mode) */
  isGuest: boolean;
  /** true once Google auth request is ready to be triggered */
  googleRequestReady: boolean;
  signInWithGoogle: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loaded: false,
  isGuest: false,
  googleRequestReady: false,
  signInWithGoogle: async () => {},
  continueAsGuest: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  // NOTE: for a standalone/EAS build you'll eventually want separate
  // iosClientId / androidClientId here too. The single webClientId works
  // fine for Expo Go and web during prototype/demo stage.
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoaded(true);
    });
    return unsubscribe;
  }, []);

  // When Google's auth popup/redirect finishes successfully, exchange the
  // id_token for a Firebase credential and sign in.
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch((e) => {
        console.error("Google sign-in failed:", e);
      });
    }
  }, [response]);

  const signInWithGoogle = useCallback(async () => {
    await promptAsync();
  }, [promptAsync]);

  const continueAsGuest = useCallback(async () => {
    await signInAnonymously(auth);
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loaded,
        isGuest: user?.isAnonymous ?? false,
        googleRequestReady: !!request,
        signInWithGoogle,
        continueAsGuest,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
