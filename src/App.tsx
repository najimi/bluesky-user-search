import { Actor, SearchActorsResponse } from "@/types";
import { Box, Container, Flex } from "@chakra-ui/react";
import { FormEvent, useCallback } from "react";
import { FormOptions, useStore } from "@/store";

import { BlueskyLink } from "@/components/bluesky-link";
import { ResultsList } from "@/components/results-list";
import { SearchForm } from "./components/search-form";

const MAX_RECURSION_DEPTH = 10;

export function App() {
  const {
    cursor,
    formOptions,
    query,
    resetResults,
    setCursor,
    setLoading,
    updateResults,
  } = useStore();

  const getSuggestions = useCallback(
    async (
      formOptions: FormOptions,
      query: string,
      cursor: string | null,
      depth = 0
    ) => {
      if (depth > MAX_RECURSION_DEPTH) {
        return;
      }

      setLoading(true);

      try {
        const url = new URL(
          "https://public.api.bsky.app/xrpc/app.bsky.actor.searchActors"
        );
        url.searchParams.append("q", query);

        if (cursor) {
          url.searchParams.append("cursor", cursor);
        }

        const response = await fetch(url.toString());
        const data = (await response.json()) as SearchActorsResponse;
        setCursor(data.cursor ?? null);

        const filteredResults = data.actors.filter((actor: Actor) => {
          const handle = actor.handle.toLowerCase();
          const displayName = actor.displayName?.toLowerCase() ?? "";
          const description = actor.description?.toLowerCase() ?? "";

          const containsOmittedWord = formOptions.omit.some(
            (omitWord) =>
              displayName.includes(omitWord) ||
              handle.includes(omitWord) ||
              description.includes(omitWord)
          );

          if (containsOmittedWord) {
            return false;
          }

          return (
            displayName &&
            ((formOptions.name &&
              displayName.toLowerCase().includes(query.toLowerCase())) ||
              handle.toLowerCase().includes(query.toLowerCase()) ||
              (formOptions.description &&
                description?.toLowerCase().includes(query.toLowerCase())))
          );
        });

        updateResults(filteredResults);

        if (filteredResults.length < 10 && data.cursor) {
          await getSuggestions(formOptions, query, data.cursor, depth + 1);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false);
      }
    },
    [setCursor, setLoading, updateResults]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim()) {
      resetResults();
      void getSuggestions(formOptions, query, cursor);
    }
  };

  return (
    <Flex direction="column" minHeight="100svh">
      <Container maxW="5xl" pt="8" flex="1">
        <form onSubmit={handleSubmit}>
          <SearchForm />
        </form>

        <ResultsList
          loadMore={() => {
            void getSuggestions(formOptions, query, cursor);
          }}
        />
      </Container>

      <Box pb="4">
        <BlueskyLink />
      </Box>
    </Flex>
  );
}
