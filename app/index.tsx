import { Redirect } from "expo-router";

export default function Index() {
  // When the app starts, go straight to /login
  return <Redirect href="/login" />;
}