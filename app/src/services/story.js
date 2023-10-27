import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const storyApi = createApi({
  reducerPath: "storyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:5001/etherquest-1baf2/us-central1/api/",
  }),
  endpoints: (builder) => ({
    getStoryIntentPositive: builder.query({
      query: () => `story/intent/positive`,
    }),
    getStoryIntentNegative: builder.query({
      query: () => `story/intent/negative`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLazyGetStoryIntentPositiveQuery,
  useLazyGetStoryIntentNegativeQuery,
} = storyApi;
