import { render } from "@testing-library/react-native";
import React from "react";
import LoginScreen from "../app/login";

describe("LoginScreen (smoke)", () => {
  it("renders without crashing", () => {
    expect(() => render(<LoginScreen />)).not.toThrow();
  });
});