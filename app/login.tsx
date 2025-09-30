// app/login.tsx
import {
    createUserWithPassword,
    loginWithEmailPassword,
    useDb,
} from "@/lib/db";
import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Button,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useAuth } from "../auth/AuthProvider";

export default function LoginScreen() {
  const db = useDb();
  const { login } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const isValidEmail = (e: string) => /\S+@\S+\.\S+/.test(e.trim());
  const isValidPassword = (p: string) => p.trim().length >= 6;

async function handleLogin() {
  if (!isValidEmail(email)) return Alert.alert("Invalid email");
  if (!isValidPassword(password)) return Alert.alert("Invalid password");

  try {
    setBusy(true);
    const userFromDb = await loginWithEmailPassword(db, email, password);
    if (!userFromDb || !userFromDb.id) {
      return Alert.alert("Login failed", "Email or password is incorrect.");
    }

    await login({
      id: userFromDb.id,
      username: userFromDb.username ?? "",  
      email: userFromDb.email ?? "",        
    });


    router.replace("/(tabs)");
  } catch (e: any) {
    Alert.alert("Error", e.message ?? String(e));
  } finally {
    setBusy(false);
  }
}


async function handleSignup() {
  if (!isValidEmail(email))
    return Alert.alert("Invalid email", "Please enter a valid email.");
  if (!isValidPassword(password))
    return Alert.alert("Invalid password", "Password must be at least 6 characters.");

  try {
    setBusy(true);

    const newUser = await createUserWithPassword(db, {
      username,
      email,
      password,
    });

    if (!newUser || !newUser.id) {
      return Alert.alert("Sign up failed", "Could not create account.");
    }

    await login({
      id: newUser.id,
      username: newUser.username ?? "",
      email: newUser.email ?? "",
    });

    router.replace("/(tabs)");
  } catch (e: any) {
    Alert.alert("Sign up error", e.message ?? String(e));
  } finally {
    setBusy(false);
  }
}



  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {mode === "login" ? "Login" : "Create Account"}
      </Text>

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
        title={
          mode === "login"
            ? "Need an account? Sign Up"
            : "Have an account? Log In"
        }
        onPress={() =>
          setMode((m) => (m === "login" ? "signup" : "login"))
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 14,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
});
