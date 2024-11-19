import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Box,
  Card,
  Container,
  Input,
  Field,
  HStack,
  Text,
  Flex,
} from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Actor, SearchActorsResponse } from "@/types";
import { BlueSkyLink } from "./components/bluesky-link";
import { ResultsList } from "./components/results-list";

export function App() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Actor[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState({
    displayName: true,
    handle: true,
    description: true,
  });

  const getSuggestions = async (
    query: string,
    cursor: string | null = null
  ) => {
    setLoading(true);
    try {
      const url = new URL(
        "https://api.bsky.app/xrpc/app.bsky.actor.searchActors"
      );
      url.searchParams.append("q", query);

      if (cursor) {
        url.searchParams.append("cursor", cursor);
      }

      const response = await fetch(url.toString());
      const data = (await response.json()) as SearchActorsResponse;

      const filteredResults = data.actors.filter((actor: Actor) => {
        return (
          actor.displayName &&
          ((options.displayName &&
            actor.displayName.toLowerCase().includes(query.toLowerCase())) ||
            (options.handle &&
              actor.handle.toLowerCase().includes(query.toLowerCase())) ||
            (options.description &&
              actor.description?.toLowerCase().includes(query.toLowerCase())))
        );
      });

      setResults((prevResults) => [...prevResults, ...filteredResults]);

      setCursor(data.cursor ?? null);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim()) {
      setResults([]);
      void getSuggestions(query);
    }
  };

  const loadMore =
    results.length > 0 && cursor
      ? void getSuggestions(query, cursor)
      : undefined;

  return (
    <Flex direction="column" minHeight="100svh">
      <Container maxW="5xl" pt="8" flex="1">
        <form onSubmit={handleSubmit}>
          <HStack justify="center" alignItems="flex-end">
            <Field.Root>
              <Box w="full">
                <Field.Label>
                  <Text fontWeight="semibold" fontSize="lg" pb="1">
                    Search BlueSky users
                  </Text>
                </Field.Label>
                <Input
                  className="peer"
                  placeholder=""
                  type="text"
                  value={query}
                  size="lg"
                  onInput={(e) =>
                    setQuery((e.target as HTMLInputElement).value)
                  }
                />
              </Box>
            </Field.Root>
            <Button
              size="lg"
              type="submit"
              loading={loading}
              disabled={loading}
            >
              Search
            </Button>
          </HStack>

          <Card.Root mt="2" pt="0" size="sm">
            <Card.Body>
              <Text fontWeight="semibold" textStyle="sm">
                Search within
              </Text>
              <HStack gap="6" pt="2">
                <Checkbox
                  checked={options.displayName}
                  onCheckedChange={() =>
                    setOptions((prev) => ({
                      ...prev,
                      displayName: !prev.displayName,
                    }))
                  }
                >
                  Display name
                </Checkbox>
                <Checkbox
                  checked={options.handle}
                  onCheckedChange={() =>
                    setOptions((prev) => ({ ...prev, handle: !prev.handle }))
                  }
                >
                  Handle
                </Checkbox>
                <Checkbox
                  checked={options.description}
                  onCheckedChange={() =>
                    setOptions((prev) => ({
                      ...prev,
                      description: !prev.description,
                    }))
                  }
                >
                  Bio
                </Checkbox>
              </HStack>
            </Card.Body>
          </Card.Root>
        </form>

        <ResultsList loading={loading} loadMore={loadMore} results={results} />
      </Container>

      <Box pb="4">
        <BlueSkyLink />
      </Box>
    </Flex>
  );
}
