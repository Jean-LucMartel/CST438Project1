import React from "react";
import { render } from "@testing-library/react-native";
import LoginScreen from "../app/(tabs)/login";

describe("LoginScreen (smoke)", () => {
  it("renders without crashing", () => {
    expect(() => render(<LoginScreen />)).not.toThrow();
  });
});