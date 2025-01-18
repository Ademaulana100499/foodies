import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "@/pages/login";
test("form inputs work", () => {
  render(<LoginPage />);
  fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "password123" },
  });
  expect(screen.getByPlaceholderText("Email")).toHaveValue("test@example.com");
  expect(screen.getByPlaceholderText("Password")).toHaveValue("password123");
});
