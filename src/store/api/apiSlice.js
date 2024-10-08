import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL, // Only base URL here
    prepareHeaders: (headers, { getState }) => {
      headers.set("x-mock-disable", "true");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login", // Endpoint for login
        method: "POST",
        body: credentials,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-login-otp", // Endpoint for OTP verification
        method: "POST",
        body: data,
      }),
    }),
  }),
});

// Export the hooks for usage in components
export const { useLoginMutation, useVerifyOtpMutation } = apiSlice;
