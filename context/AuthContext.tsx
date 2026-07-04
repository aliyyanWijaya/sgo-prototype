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
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";

// Required so the browser popup/redirect closes properly after Google login
WebBrowser.maybeCompleteAuthSession();

const googleProvider = new GoogleAuthProvider();

interface AuthContextValue {
  user: User | null;
  loaded: boolean;
  /** true if the current user is signed in anonymously (Guest mode) */
  isGuest: boolean;
  /** true once Google auth is ready to be triggered (always true on web) */
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

  // Only used on native (iOS/Android). On web we use signInWithPopup instead,
  // which needs no redirect URI setup because Firebase already whitelists
  // its own authDomain automatically.
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

  // Native-only: when the Google auth popup/redirect finishes successfully,
  // exchange the id_token for a Firebase credential and sign in.
  useEffect(() => {
    if (Platform.OS === "web") return;
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch((e) => {
        console.error("Google sign-in failed:", e);
      });
    }
  }, [response]);

  const signInWithGoogle = useCallback(async () => {
    if (Platform.OS === "web") {
      // No redirect URI registration needed — Firebase handles this
      // via its own authDomain popup flow.
      await signInWithPopup(auth, googleProvider);
    } else {
      await promptAsync();
    }
  }, [promptAsync]);

  const continueAsGuest = useCallback(async () => {
    const credential = await signInAnonymously(auth);
    await updateProfile(credential.user, { displayName: "Guest" });
    // updateProfile mutates the User object but doesn't reliably trigger
    // onAuthStateChanged, so we update state manually to force a re-render
    // with the new displayName reflected immediately.
    setUser({ ...credential.user });
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
        googleRequestReady: Platform.OS === "web" ? true : !!request,
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
