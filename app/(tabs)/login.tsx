// app/(tabs)/login.tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useDb, createUserWithPassword, loginWithEmailPassword } from "@/lib/db";

export default function LoginScreen() {
  const db = useDb();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const isValidEmail = (e: string) => /\S+@\S+\.\S+/.test(e.trim());
  const isValidPassword = (p: string) => p.trim().length >= 6;

  async function handleLogin() {
    if (!isValidEmail(email)) return Alert.alert("Invalid email", "Please enter a valid email.");
    if (!isValidPassword(password))
      return Alert.alert("Invalid password", "Password must be at least 6 characters.");

    try {
      setBusy(true);
      const user = await loginWithEmailPassword(db, email, password);
      if (!user) return Alert.alert("Login failed", "Email or password is incorrect.");
      router.replace("/(tabs)/index");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? String(e));
    } finally {
      setBusy(false);
    }
  }

  async function handleSignup() {
    if (!isValidEmail(email)) return Alert.alert("Invalid email", "Please enter a valid email.");
    if (!isValidPassword(password))
      return Alert.alert("Invalid password", "Password must be at least 6 characters.");

    try {
      setBusy(true);
      // Simple default username from the email local part
      const username = email.split("@")[0] || "user";
      const user = await createUserWithPassword(db, {
        username,
        email: email.trim(),
        password,
      });
      if (!user) return Alert.alert("Sign up error", "Could not create the account.");
      Alert.alert("Welcome!", `Account created for @${user.username}`);
      router.replace("/(tabs)/index");
    } catch (e: any) {
      Alert.alert("Sign up error", e?.message ?? String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mode === "login" ? "Login" : "Create Account"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {busy ? (
        <ActivityIndicator style={{ marginBottom: 10 }} />
      ) : mode === "login" ? (
        <Button title="Login" onPress={handleLogin} />
      ) : (
        <Button title="Sign Up" onPress={handleSignup} />
      )}

      <View style={{ height: 12 }} />
      <Button
        title={mode === "login" ? "Need an account? Sign Up" : "Have an account? Log In"}
        onPress={() => setMode((m) => (m === "login" ? "signup" : "login"))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "800", marginBottom: 24, textAlign: "center" },
  input: { borderWidth: 1, padding: 12, marginBottom: 14, borderRadius: 8, backgroundColor: "#fff" },
});
