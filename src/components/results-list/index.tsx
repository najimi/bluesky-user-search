import { Center, HStack, Link, Stack, Table, Text } from "@chakra-ui/react";
import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LuSearch } from "react-icons/lu";
import { ResultsListProps } from "./types";
import { useStore } from "@/store";

export const ResultsList = ({ loadMore }: ResultsListProps) => {
  const { loading, results, cursor, query } = useStore();

  const showSkeleton = Boolean(loading && results.length === 0);
  const showNoResults = Boolean(
    !loading && results.length === 0 && query.length > 0
  );

  return (
    <>
      {showSkeleton && (
        <HStack gap="5">
          <SkeletonCircle size="12" />
          <Stack flex="1">
            <Skeleton height="5" />
            <Skeleton height="5" width="80%" />
          </Stack>
        </HStack>
      )}

      {showNoResults && (
        <EmptyState
          icon={<LuSearch />}
          title="No results found"
          description="Try adjusting your search"
        />
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
