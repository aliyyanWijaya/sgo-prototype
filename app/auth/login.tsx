import { useAuth } from "@/context/AuthContext";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function LoginScreen() {
  const { signInWithGoogle, continueAsGuest, googleRequestReady } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SGO</Text>
      <Text style={styles.subtitle}>
        Sign in to save your member card and preferences
      </Text>

      <Pressable
        style={styles.googleButton}
        onPress={signInWithGoogle}
        disabled={!googleRequestReady}
      >
        {googleRequestReady ? (
          <>
            <Image
              source={{
                uri: "https://developers.google.com/identity/images/g-logo.png",
              }}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </>
        ) : (
          <ActivityIndicator color="#2B7A77" />
        )}
      </Pressable>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      <Pressable style={styles.guestButton} onPress={continueAsGuest}>
        <Text style={styles.guestButtonText}>Continue as Guest</Text>
      </Pressable>

      <Text style={styles.guestNote}>
        As a guest you can explore the app, but you won&apos;t be able to access
        your member card or save your details.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: "#2B7A77",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#5A6670",
    marginBottom: 32,
    marginTop: 6,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D0D5D9",
    borderRadius: 10,
    paddingVertical: 14,
    gap: 10,
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E9EC",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#9AA5AD",
    fontSize: 13,
  },
  guestButton: {
    backgroundColor: "#F1F5F4",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  guestButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2B7A77",
  },
  guestNote: {
    marginTop: 16,
    fontSize: 13,
    color: "#9AA5AD",
    textAlign: "center",
    lineHeight: 18,
  },
});
