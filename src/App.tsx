import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Box,
  Center,
  Container,
  Input,
  Stack,
  Field,
  HStack,
  Table,
  Text,
  Link,
} from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import "./app.css";
import { Actor, SearchActorsResponse } from "@/types";

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

  const loadMore = () => {
    if (cursor) {
      void getSuggestions(query, cursor);
    }
  };

  return (
    <Container maxW="5xl" py="8">
      <div className="card">
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

          <HStack gap="6" py="2">
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
        </form>
        <Box pt="4">
          {loading && results.length === 0 && (
            <HStack gap="5">
              <SkeletonCircle size="12" />
              <Stack flex="1">
                <Skeleton height="5" />
                <Skeleton height="5" width="80%" />
              </Stack>
            </HStack>
          )}
          {results.length > 0 && (
            <Table.Root interactive size="sm">
              <Table.Body>
                {results.map((actor) => (
                  <Table.Row key={actor.did}>
                    <Table.Cell w="40px" verticalAlign="top">
                      <Avatar
                        src={actor.avatar}
                        name={actor.displayName}
                        shape="full"
                        size="md"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Stack gapX="0" gapY={{ base: "1", md: "0" }}>
                        <Stack
                          gap={{ base: "0", md: "1" }}
                          direction={{ base: "column", md: "row" }}
                        >
                          {actor.displayName && (
                            <Text fontWeight="semibold" fontSize="sm">
                              {actor.displayName}
                            </Text>
                          )}
                          <Link
                            fontWeight="semibold"
                            color="blue.500"
                            href={`https://bsky.app/profile/${actor.handle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="underline"
                          >
                            @{actor.handle}
                          </Link>
                        </Stack>
                        {actor.description && <p>{actor.description}</p>}
                      </Stack>
                    </Table.Cell>
                    <Table.Cell></Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          )}
        </Box>

        {results.length > 0 && cursor && (
          <Center pt="5">
            <Button onClick={loadMore} loading={loading} disabled={loading}>
              Load More
            </Button>
          </Center>
        )}
      </div>
    </Container>
  );
}
