import {
  Box,
  Center,
  HStack,
  Link,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ResultsListProps } from "./types";
import { useStore } from "@/store";

export const ResultsList = ({ loadMore }: ResultsListProps) => {
  const loading = useStore((state) => state.loading);
  const results = useStore((state) => state.results);
  const cursor = useStore((state) => state.cursor);
  const query = useStore((state) => state.query);
  const formOptions = useStore((state) => state.formOptions);

  return (
    <>
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
    </>
  );
};
