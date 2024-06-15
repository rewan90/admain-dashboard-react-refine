import graphqlDataProvider, {
  GraphQLClient,
  liveProvider as graphqlLiveProvider,
} from "@refinedev/nestjs-query";

import { createClient } from "graphql-ws";

import { fetchWrapper } from "./fetch-wrapper";

export const API_BASE_URL = "https://api.crm.refine.dev";
export const API_URL = `${API_BASE_URL}/graphql`;
export const WS_URL = "wss://api.crm.refine.dev/graphql";

export const client = new GraphQLClient(API_URL, {
  //   Executes a fetch request with the given URL and options.
  //   @param {string} url - The URL to fetch.
  //   @param {RequestInit} options - The options for the fetch request.
  //  @return {Promise<Response>} A promise that resolves to the fetched response or rejects with an error.

  fetch: (url: string, options: RequestInit) => {
    try {
      return fetchWrapper(url, options);
    } catch (error) {
      return Promise.reject(error as Error);
    }
  },
});

export const wsClient =
  typeof window !== "undefined"
    ? createClient({
      url: WS_URL,
      connectionParams: () => {
        const accessToken = localStorage.getItem("access_token");

        return {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
    })
    : undefined;

export const dataProvider = graphqlDataProvider(client);

export const liveProvider = wsClient
  ? graphqlLiveProvider(wsClient)
  : undefined;
