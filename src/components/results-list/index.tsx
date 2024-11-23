import "./styles.css";

import { Center, Flex, HStack, Link, Stack, Text } from "@chakra-ui/react";
import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LuSearch } from "react-icons/lu";
import { ResultsListProps } from "./types";
import { motion } from "motion/react";
import { useStore } from "@/store";

export const ResultsList = ({
  loadMore,
  intersectionRef,
}: ResultsListProps) => {
  const { loading, results, cursor } = useStore();

  const hasResults = Boolean((results?.length ?? 0) > 0);
  const showSkeleton = Boolean(loading && results?.length === 0);
  const showNoResults = Boolean(!loading && results?.length === 0);

  const variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

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

      {results === null && !loading && (
        <Flex height="100%" justify="center" align="center" color="red">
          <img
            alt=""
            className="placeholder-image"
            loading="lazy"
            src="/profile-placeholder.svg"
          />
        </Flex>
      )}

      {showNoResults && (
        <Flex
          height="70%"
          justify="center"
          align="center"
          gap="2"
          direction="column"
        >
          <LuSearch size="40px" />
          <Text fontWeight="semibold" fontSize="x-large">
            No results found
          </Text>
          <Text fontWeight="" fontSize="sm">
            Try adjusting your search
          </Text>
        </Flex>
      )}

      {hasResults && (
        <ul className="user-list">
          {results?.map((actor) => (
            <motion.li
              key={actor.did}
              className="user-item"
              whileInView="visible"
              variants={variants}
              viewport={{
                amount: 0.8,
                margin: "40px 0px 0px 0px",
                once: true,
                root: intersectionRef,
              }}
            >
              <Avatar
                src={actor.avatar}
                name={actor.displayName}
                shape="full"
                size="md"
              />
              <Stack gapX="0" gapY={{ base: "1", md: "0" }}>
                <Stack
                  gap={{ base: "0", md: "1" }}
                  direction={{ base: "column", md: "row" }}
                  lineHeight={["17px", "initial"]}
                >
                  {actor.displayName && (
                    <Text fontWeight="semibold" fontSize="sm">
                      {actor.displayName}
                    </Text>
                  )}
                  <Link
                    fontSize="sm"
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
                {actor.description && (
                  <Text fontSize="xs" color="#555">
                    {actor.description}
                  </Text>
                )}
              </Stack>
            </motion.li>
          ))}
        </ul>
      )}

      {hasResults && cursor && (
        <Center pt="5">
          <Button onClick={loadMore} loading={loading} disabled={loading}>
            Load More
          </Button>
        </Center>
      )}
    </>
  );
};
