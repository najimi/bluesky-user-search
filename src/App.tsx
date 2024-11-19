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
import { useStore } from "./store";

export function App() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Actor[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const formOptions = useStore((state) => state.formOptions);
  const updateFormOptions = useStore((state) => state.updateFormOptions);

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
          ((formOptions.displayName &&
            actor.displayName.toLowerCase().includes(query.toLowerCase())) ||
            (formOptions.handle &&
              actor.handle.toLowerCase().includes(query.toLowerCase())) ||
            (formOptions.description &&
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
                  checked={formOptions.displayName}
                  onCheckedChange={() =>
                    updateFormOptions({ displayName: !formOptions.displayName })
                  }
                >
                  Display name
                </Checkbox>
                <Checkbox
                  checked={formOptions.handle}
                  onCheckedChange={() =>
                    updateFormOptions({ handle: !formOptions.handle })
                  }
                >
                  Handle
                </Checkbox>
                <Checkbox
                  checked={formOptions.description}
                  onCheckedChange={() =>
                    updateFormOptions({ description: !formOptions.description })
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
