import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { fetchAPI } from "@/services/api";
import { AxiosError } from "axios";

// Create a mock instance of axios
let mockAxios: MockAdapter;

beforeEach(() => {
  // Initialize MockAdapter before each test to avoid undefined error
  mockAxios = new MockAdapter(axios);
});

afterEach(() => {
  // Reset the mock after each test to ensure clean state
  mockAxios.reset();
});

describe("fetchAPI", () => {
  test("should fetch data successfully", async () => {
    const mockResponse = { data: { message: "Success" } };

    // Mock the GET request with a successful response
    mockAxios.onGet("/endpoint").reply(200, mockResponse);

    const options = {
      method: "GET",
      url: "/endpoint",
    };

    // Call the fetchAPI function
    const response = await fetchAPI(options);

    // Validate that the response matches the mock
    expect(response.data).toEqual(mockResponse);
    expect(response.status).toBe(200);
  });

  test("should handle error when request fails", async () => {
    const mockError = { message: "Request failed" };

    // Mock the GET request with an error response
    mockAxios.onGet("/endpoint").reply(500, mockError);

    const options = {
      method: "GET",
      url: "/endpoint",
    };

    try {
      // Call the fetchAPI function and expect it to throw
      await fetchAPI(options);
    } catch (error: unknown) {
      // Type assertion for AxiosError
      if (axios.isAxiosError(error)) {
        // Now we can safely access 'response' and 'status' properties
        expect(error.response?.status).toBe(500);
        expect(error.response?.data).toEqual(mockError);
      } else {
        // If it's not an AxiosError, throw a new error
        throw new Error("Unexpected error type");
      }
    }
  });

  test("should send the correct headers and URL parameters", async () => {
    const mockResponse = { data: { message: "Success" } };

    // Mock the GET request with a successful response
    mockAxios.onGet("/endpoint").reply(200, mockResponse);

    const options = {
      method: "GET",
      url: "/endpoint",
      headers: {
        apiKey: "test-api-key",
      },
    };

    // Call the fetchAPI function
    const response = await fetchAPI(options);

    // Validate that the correct headers are sent
    expect(response.data).toEqual(mockResponse);
    expect(mockAxios.history.get[0].headers["apiKey"]).toBe("test-api-key");
    expect(mockAxios.history.get[0].url).toBe("/endpoint");
  });
});
