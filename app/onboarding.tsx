import { router } from "expo-router";
import { useState } from "react";

import { generateMemberData, saveMemberData } from "@/utils/membership";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useOnboarding } from "@/context/OnboardingContext";
import { useUserPreferences } from "@/context/UserPreferencesContext";
// ─── Step 1: Welcome ────────────────────────────────────────────────────────

function WelcomeStep({
  name,
  onNameChange,
  onNext,
}: {
  name: string;
  onNameChange: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.stepContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoArea}>
          <Text style={styles.logoText}>SavGoSpend</Text>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>SGO</Text>
          </View>
        </View>

        <Text style={styles.tagline}>
          Your travel companion that treats you with dignity
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{"What's your name?"}</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={onNameChange}
            placeholder="Enter your name"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
            returnKeyType="done"
            accessibilityLabel="Your name"
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={onNext}
          accessibilityRole="button"
          accessibilityLabel="Get Started"
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Step 2: Opt-in Preferences ─────────────────────────────────────────────

type PreferencesStepProps = {
  notifications: boolean;
  shareLocation: boolean;
  largerText: boolean;
  onToggle: (key: "notifications" | "shareLocation" | "largerText") => void;
  onNext: () => void;
};

function PreferencesStep({
  notifications,
  shareLocation,
  largerText,
  onToggle,
  onNext,
}: PreferencesStepProps) {
  const rows: {
    key: "notifications" | "shareLocation" | "largerText";
    label: string;
    description: string;
    value: boolean;
    testID: string;
  }[] = [
    {
      key: "notifications",
      label: "Notifications",
      description: "Get alerts about nearby retailers and events",
      value: notifications,
      testID: "toggle-notifications",
    },
    {
      key: "shareLocation",
      label: "Share Location",
      description: "Needed to show shops and deals near you",
      value: shareLocation,
      testID: "toggle-share-location",
    },
    {
      key: "largerText",
      label: "Larger Text",
      description: "Increases text size throughout the app",
      value: largerText,
      testID: "toggle-larger-text",
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.stepContent}>
      <Text style={styles.stepTitle}>Set your preferences</Text>
      <Text style={styles.stepSubtitle}>
        All options are off by default — turn on only what you want.{"\n"}
        You can change these later in Profile.
      </Text>

      <View style={styles.toggleList}>
        {rows.map((row, index) => (
          <View
            key={row.key}
            style={[
              styles.toggleRow,
              index < rows.length - 1 && styles.toggleRowBorder,
            ]}
          >
            <View style={styles.toggleText}>
              <Text style={styles.toggleLabel}>{row.label}</Text>
              <Text style={styles.toggleDescription}>{row.description}</Text>
            </View>
            <Switch
              testID={row.testID}
              value={row.value}
              onValueChange={() => onToggle(row.key)}
              trackColor={{ false: "#D1D5DB", true: "#2B7A77" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D1D5DB"
              accessibilityLabel={row.label}
              accessibilityRole="switch"
              accessibilityState={{ checked: row.value }}
            />
          </View>
        ))}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={onNext}
        accessibilityRole="button"
        accessibilityLabel="Next"
      >
        <Text style={styles.primaryButtonText}>Next</Text>
      </Pressable>
    </ScrollView>
  );
}

// ─── Step 3: Done ───────────────────────────────────────────────────────────

function DoneStep({
  name,
  onEnterApp,
}: {
  name: string;
  onEnterApp: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (loading) return;
    setLoading(true);
    await onEnterApp();
  };

  return (
    <View style={styles.doneContainer}>
      <View style={styles.checkCircle}>
        <Text style={styles.checkMark}>✓</Text>
      </View>
      <Text style={styles.doneTitle}>{"You're all set!"}</Text>
      <Text style={styles.doneSubtitle}>
        Welcome to SavGoSpend{name ? `, ${name}` : ""}.
      </Text>
      <Text style={styles.doneBody}>
        Your travel companion is ready to help you explore and save.
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          styles.enterButton,
          pressed && styles.buttonPressed,
          loading && styles.buttonDisabled,
        ]}
        onPress={handlePress}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="Enter the App"
      >
        <Text style={styles.primaryButtonText}>
          {loading ? "Loading…" : "Enter the App"}
        </Text>
      </Pressable>
    </View>
  );
}

// ─── Root Onboarding Screen ──────────────────────────────────────────────────

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [notifications, setNotifications] = useState(false);
  const [shareLocation, setShareLocation] = useState(false);
  const [largerText, setLargerText] = useState(false);
  const { setPreference } = useUserPreferences();
  const { completeOnboarding } = useOnboarding();

  const toggle = (key: "notifications" | "shareLocation" | "largerText") => {
    if (key === "notifications") setNotifications((v) => !v);
    else if (key === "shareLocation") setShareLocation((v) => !v);
    else setLargerText((v) => !v);
  };

  const handleEnterApp = async () => {
    const trimmedName = name.trim() || "Traveller";
    await Promise.all([
      setPreference("memberName", trimmedName),
      setPreference("notifications", notifications),
      setPreference("shareLocation", shareLocation),
      setPreference("largerText", largerText),
      saveMemberData(generateMemberData(trimmedName)),
    ]);
    await completeOnboarding();
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.safe}>
      {step === 0 && (
        <WelcomeStep
          name={name}
          onNameChange={setName}
          onNext={() => setStep(1)}
        />
      )}
      {step === 1 && (
        <PreferencesStep
          notifications={notifications}
          shareLocation={shareLocation}
          largerText={largerText}
          onToggle={toggle}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <DoneStep name={name.trim()} onEnterApp={handleEnterApp} />
      )}
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const BRAND = "#2B7A77";
const TEXT_PRIMARY = "#111827";
const TEXT_SECONDARY = "#374151";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F0EB",
  },

  // Shared step layout
  stepContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 40,
  },

  // Step 1 — Welcome
  logoArea: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "800",
    color: BRAND,
    letterSpacing: -0.5,
  },
  logoBadge: {
    backgroundColor: BRAND,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 6,
  },
  logoBadgeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 18,
    color: TEXT_SECONDARY,
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 48,
  },
  inputGroup: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_PRIMARY,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 18,
    color: TEXT_PRIMARY,
    minHeight: 56,
  },

  // Step 2 — Preferences
  stepTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    marginBottom: 10,
  },
  stepSubtitle: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    lineHeight: 22,
    marginBottom: 36,
  },
  toggleList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    minHeight: 72,
    gap: 16,
  },
  toggleRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  toggleText: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: TEXT_PRIMARY,
    marginBottom: 3,
  },
  toggleDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },

  // Step 3 — Done
  doneContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: BRAND,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  checkMark: {
    fontSize: 44,
    color: "#FFFFFF",
    lineHeight: 52,
  },
  doneTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: TEXT_PRIMARY,
    marginBottom: 10,
    textAlign: "center",
  },
  doneSubtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: BRAND,
    marginBottom: 12,
    textAlign: "center",
  },
  doneBody: {
    fontSize: 16,
    color: TEXT_SECONDARY,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 48,
  },

  // Shared buttons
  primaryButton: {
    backgroundColor: BRAND,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    minHeight: 56,
    justifyContent: "center",
  },
  enterButton: {
    width: "100%",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
