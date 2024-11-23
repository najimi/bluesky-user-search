import { Actor, SearchActorsResponse } from "@/types";
import { Box, Text } from "@chakra-ui/react";
import { FormEvent, useCallback, useRef, useState } from "react";
import { FormOptions, useStore } from "@/store";

import { Alert } from "@/components/ui/alert";
import { ResultsList } from "@/components/results-list";
import { SearchForm } from "@/components/search-form";

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

  const [showAlert, setShowAlert] = useState(false);

  const intersectionRef = useRef<HTMLDivElement>(null);

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

      const lowercaseQuery = query.trim().toLocaleLowerCase();

      setLoading(true);

      try {
        const url = new URL(
          "https://public.api.bsky.app/xrpc/app.bsky.actor.searchActors"
        );

        url.searchParams.append("q", lowercaseQuery);

        if (cursor) {
          url.searchParams.append("cursor", cursor);
        }

        const response = await fetch(url.toString());

        if (response.status === 429) {
          setShowAlert(true);
          return;
        }

        const data = (await response.json()) as SearchActorsResponse;
        setCursor(data.cursor ?? null);
        setShowAlert(false);

        const filteredResults = data.actors.filter((actor: Actor) => {
          const handle = actor.handle.toLowerCase();
          const displayName = actor.displayName?.toLowerCase() ?? "";
          const description = actor.description?.toLowerCase() ?? "";

          if (formOptions.noDisplayName && displayName.length === 0) {
            return false;
          }

          if (formOptions.noDescription && description.length === 0) {
            return false;
          }

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
            (formOptions.name &&
              (handle.includes(lowercaseQuery) ||
                displayName.includes(lowercaseQuery))) ||
            (formOptions.description && description.includes(lowercaseQuery))
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
    const value = query.trim();
    if (value) {
      resetResults();
      void getSuggestions(formOptions, value, cursor);
      if (window.fathom) {
        window.fathom.trackEvent("search", { _value: value });
      }
    }
  };

  return (
    <>
      <Box as="header">
        <Text as="h1" textStyle="3xl" fontWeight="bold">
          <Text as="span" fontWeight="semibold" textTransform="uppercase">
            Bluesky
          </Text>
          User search
        </Text>
      </Box>
      <Box as="main" className="main">
        <Box as="section">
          <form onSubmit={handleSubmit}>
            <SearchForm />
          </form>
        </Box>
        <Box as="section" className="results-wrapper" ref={intersectionRef}>
          {showAlert && (
            <Alert
              borderRadius="12px"
              status="error"
              title="Rate Limit Exceeded"
            >
              We&apos;re too popular. Try again in some amount of time
              ¯\_(ツ)_/¯
            </Alert>
          )}
          <Box className="scroll-container" pb="1.2rem">
            <ResultsList
              intersectionRef={intersectionRef}
              loadMore={() => {
                void getSuggestions(formOptions, query, cursor);
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}
