import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from "../components/AppText";

import { useUserPreferences } from "@/context/UserPreferencesContext";

// ─── Constants ────────────────────────────────────────────────────────────────

// iOS Simulator:   http://localhost:3000
// Android Emulator: http://10.0.2.2:3000
// Physical device:  replace with your machine's LAN IP, e.g. http://192.168.1.x:3000
const AROHA_API_URL = "https://sgo-prototype.onrender.com";

export const AROHA_INTRO_SEEN = "aroha_intro_seen";

const PRONUNCIATION_AUDIO:
  | number
  | null = require("../assets/audio/aroha-pronunciation.mp4");

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "user" | "aroha";
type Message = { id: string; role: Role; content: string };
type HistoryItem = { role: "user" | "assistant"; content: string };

const INTRO_MESSAGE: Message = {
  id: "intro",
  role: "aroha",
  content:
    "Kia ora! I'm Aroha, your SGO travel companion. I can help you find great deals, " +
    "understand your membership, and make the most of your travels. " +
    "What can I help you with today?",
};

// ─── Pronunciation guide modal ────────────────────────────────────────────────

function PronunciationModal({ onDismiss }: { onDismiss: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioNote, setAudioNote] = useState<string | null>(null);

  const handlePlayAudio = async () => {
    if (!PRONUNCIATION_AUDIO) {
      setAudioNote("Audio preview coming soon.");
      return;
    }
    try {
      setIsPlaying(true);
      setAudioNote(null);
      const { sound } = await Audio.Sound.createAsync(PRONUNCIATION_AUDIO);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if ("didJustFinish" in status && status.didJustFinish) {
          sound.unloadAsync();
          setIsPlaying(false);
        }
      });
    } catch {
      setAudioNote("Could not play audio. Please try again.");
      setIsPlaying(false);
    }
  };

  return (
    // onStartShouldSetResponder stops touches on the card from bubbling to the backdrop
    <View
      testID="aroha-intro-modal"
      style={modalStyles.card}
      onStartShouldSetResponder={() => true}
    >
      {/* Title */}
      <AppText style={modalStyles.title}>Meet Aroha</AppText>

      {/* Avatar + name */}
      <View style={modalStyles.nameRow}>
        <View style={modalStyles.bigAvatar}>
          <AppText style={modalStyles.bigAvatarLetter}>A</AppText>
        </View>
        <View style={modalStyles.nameBlock}>
          <AppText style={modalStyles.arohaName}>Aroha</AppText>
          {/* Phonetic with stress on middle syllable highlighted */}
          <AppText testID="aroha-phonetic" style={modalStyles.phonetic}>
            {"ah-"}
            <AppText style={modalStyles.phoneticStress}>ROH</AppText>
            {"-hah"}
          </AppText>
        </View>
      </View>

      {/* Description */}
      <AppText style={modalStyles.description}>
        <AppText style={modalStyles.descriptionBold}>Aroha</AppText>
        {" is a Māori word meaning love and compassion.\n\n"}
        She is your friendly SGO companion — here to help you explore, save, and
        travel with confidence. Ask her anything, any time.
      </AppText>

      {/* Audio pronunciation button */}
      <Pressable
        style={({ pressed }) => [
          modalStyles.audioBtn,
          pressed && modalStyles.audioBtnPressed,
          isPlaying && modalStyles.audioBtnActive,
        ]}
        onPress={handlePlayAudio}
        accessibilityRole="button"
        accessibilityLabel="Hear how to pronounce Aroha"
      >
        <Feather
          name={isPlaying ? "volume-2" : "play-circle"}
          size={20}
          color={BRAND}
        />
        <AppText style={modalStyles.audioBtnText}>
          {isPlaying ? "Playing…" : "Hear the pronunciation"}
        </AppText>
      </Pressable>

      {audioNote !== null && (
        <AppText style={modalStyles.audioNote}>{audioNote}</AppText>
      )}

      {/* Dismiss button */}
      <Pressable
        testID="aroha-intro-dismiss"
        style={({ pressed }) => [
          modalStyles.gotItBtn,
          pressed && modalStyles.gotItBtnPressed,
        ]}
        onPress={onDismiss}
        accessibilityRole="button"
        accessibilityLabel="Got it, I understand how to pronounce Aroha"
      >
        <AppText style={modalStyles.gotItText}>Got it!</AppText>
      </Pressable>
    </View>
  );
}

// ─── Chat sub-components ──────────────────────────────────────────────────────

function ArohaAvatar() {
  return (
    <View style={styles.avatar}>
      <AppText style={styles.avatarText}>A</AppText>
    </View>
  );
}

function MessageBubble({
  message,
  fontSize,
}: {
  message: Message;
  fontSize: number;
}) {
  const isUser = message.role === "user";
  return (
    <View style={[styles.bubbleRow, isUser ? styles.rowUser : styles.rowAroha]}>
      {!isUser && <ArohaAvatar />}
      <View
        style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAroha]}
      >
        <AppText
          style={[
            styles.bubbleText,
            isUser ? styles.textUser : styles.textAroha,
            { fontSize, lineHeight: fontSize * 1.5 },
          ]}
        >
          {message.content}
        </AppText>
      </View>
    </View>
  );
}

function TypingIndicator() {
  return (
    <View style={[styles.bubbleRow, styles.rowAroha]}>
      <ArohaAvatar />
      <View style={[styles.bubble, styles.bubbleAroha, styles.typingBubble]}>
        <ActivityIndicator size="small" color={BRAND} />
        <AppText style={styles.typingText}>Aroha is thinking…</AppText>
      </View>
    </View>
  );
}

function ErrorBanner({
  message,
  fontSize,
}: {
  message: string;
  fontSize: number;
}) {
  return (
    <View style={styles.errorBanner}>
      <Feather name="alert-circle" size={18} color="#B45309" />
      <AppText style={[styles.errorText, { fontSize }]}>{message}</AppText>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function ArohaScreen() {
  const { scale } = useUserPreferences();
  const [messages, setMessages] = useState<Message[]>([INTRO_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showIntroModal, setShowIntroModal] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  // Check on mount whether the user has already seen the pronunciation guide.
  useEffect(() => {
    AsyncStorage.getItem(AROHA_INTRO_SEEN).then((val) => {
      if (val !== "true") setShowIntroModal(true);
    });
  }, []);

  const handleDismissIntro = () => {
    // Fire-and-forget: persist the flag, then hide the modal immediately so the
    // dismiss feels instant rather than waiting for the storage write.
    AsyncStorage.setItem(AROHA_INTRO_SEEN, "true");
    setShowIntroModal(false);
  };

  const msgFontSize = scale(16);

  const buildHistory = (msgs: Message[]): HistoryItem[] =>
    msgs
      .filter((m) => m.id !== "intro")
      .map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      }));

  const scrollToBottom = (animated = true) => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated }), 60);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setError(null);

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
    };
    const history = buildHistory(messages);

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    scrollToBottom();

    try {
      const res = await fetch(`${AROHA_API_URL}/api/aroha-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, conversationHistory: history }),
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      const data: { reply: string } = await res.json();

      const arohaMsg: Message = {
        id: `a-${Date.now()}`,
        role: "aroha",
        content: data.reply,
      };

      setMessages((prev) => [...prev, arohaMsg]);
    } catch {
      setError(
        "Aroha is having trouble connecting right now. " +
          "Please check that the server is running, then try again.",
      );
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const canSend = input.trim().length > 0 && !loading;

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      {/* One-time pronunciation guide — conditionally mounted so it's absent from
          the tree (and test queries) when not needed. */}
      {showIntroModal && (
        <Modal
          visible
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={handleDismissIntro}
        >
          <Pressable style={modalStyles.backdrop} onPress={handleDismissIntro}>
            <PronunciationModal onDismiss={handleDismissIntro} />
          </Pressable>
        </Modal>
      )}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.messageContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollToBottom(false)}
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} fontSize={msgFontSize} />
          ))}

          {loading && <TypingIndicator />}
          {error && <ErrorBanner message={error} fontSize={scale(14)} />}
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            style={[styles.textInput, { fontSize: scale(16) }]}
            value={input}
            onChangeText={setInput}
            placeholder="Ask Aroha anything…"
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={500}
            returnKeyType="send"
            blurOnSubmit
            onSubmitEditing={sendMessage}
            editable={!loading}
            accessibilityLabel="Type a message to Aroha"
          />
          <Pressable
            style={({ pressed }) => [
              styles.sendBtn,
              pressed && styles.sendBtnPressed,
              !canSend && styles.sendBtnDisabled,
            ]}
            onPress={sendMessage}
            disabled={!canSend}
            accessibilityRole="button"
            accessibilityLabel="Send message"
            accessibilityState={{ disabled: !canSend }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Feather name="send" size={20} color="#FFFFFF" />
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const BRAND = "#2B7A77";

// Modal styles
const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 24,
  },

  // Avatar + name row
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  bigAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: BRAND,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  bigAvatarLetter: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },
  nameBlock: {
    gap: 4,
  },
  arohaName: {
    fontSize: 24,
    fontWeight: "700",
    color: BRAND,
  },
  phonetic: {
    fontSize: 18,
    color: "#6B7280",
    fontStyle: "italic",
    letterSpacing: 0.5,
  },
  phoneticStress: {
    color: BRAND,
    fontWeight: "700",
    fontStyle: "italic",
  },

  // Description
  description: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 25,
    marginBottom: 24,
  },
  descriptionBold: {
    fontWeight: "700",
    color: "#111827",
  },

  // Audio button
  audioBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: BRAND,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  audioBtnPressed: {
    backgroundColor: "rgba(43,122,119,0.06)",
  },
  audioBtnActive: {
    backgroundColor: "rgba(43,122,119,0.1)",
  },
  audioBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: BRAND,
  },

  // Audio note (e.g. "coming soon")
  audioNote: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 12,
    fontStyle: "italic",
  },

  // Got it
  gotItBtn: {
    backgroundColor: BRAND,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 8,
  },
  gotItBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  gotItText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});

// Chat styles
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F0EB" },
  flex: { flex: 1 },

  messageContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    gap: 14,
  },

  bubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  rowUser: { justifyContent: "flex-end" },
  rowAroha: { justifyContent: "flex-start" },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BRAND,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  bubble: {
    maxWidth: "78%",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleUser: {
    backgroundColor: BRAND,
    borderBottomRightRadius: 4,
  },
  bubbleAroha: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 1,
  },
  bubbleText: {},
  textUser: { color: "#FFFFFF" },
  textAroha: { color: "#111827" },

  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  typingText: {
    fontSize: 14,
    color: "#6B7280",
    fontStyle: "italic",
  },

  errorBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#FEF3C7",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  errorText: {
    flex: 1,
    color: "#92400E",
    lineHeight: 22,
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F5F0EB",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
    color: "#111827",
    minHeight: 48,
    maxHeight: 120,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: BRAND,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  sendBtnPressed: { opacity: 0.85, transform: [{ scale: 0.95 }] },
  sendBtnDisabled: { opacity: 0.4 },
});
