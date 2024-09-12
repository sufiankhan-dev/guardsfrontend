import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/auth/login`,
    prepareHeaders: (headers, { getState }) => {
      headers.set("x-mock-disable", "true");
      return headers;
    },
  }),
  endpoints: (builder) => ({}),
});
