import { AnimatePresence, motion } from "motion/react";
import {
  Box,
  Card,
  Flex,
  Grid,
  Input,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CloseButton } from "@/components/ui/close-button";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { LuFilter } from "react-icons/lu";
import { useStore } from "@/store";

export const SearchForm = () => {
  const [formError, setFormError] = useState(false);
  const { formOptions, loading, setQuery, query, updateFormOptions } =
    useStore();

  const [showFilters, setShowFilters] = useState(false);
  const filtersButtonRef = useRef<HTMLButtonElement>(null);
  const firstFilterElementRef = useRef<HTMLInputElement>(null);

  const handleOmitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(false);
    const value = event.target.value.trim();

    if (!value) {
      updateFormOptions({ omit: [] });
    }

    const omit = value
      .split(",")
      .map((word) => word.trim().toLocaleLowerCase())
      .filter(Boolean);

    if (omit.includes(query)) {
      setFormError(true);
      return;
    }

    updateFormOptions({ omit });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setShowFilters(false);
    }
  };

  useEffect(() => {
    if (showFilters) {
      firstFilterElementRef.current?.focus();
    } else {
      filtersButtonRef.current?.focus();
    }
  }, [showFilters]);

  return (
    // Extra Padding here accounting for focus rings
    <Box paddingLeft="4px" paddingRight="4px" position="relative">
      <Grid
        gap="6px"
        position="relative"
        pt="4"
        templateColumns={["1fr auto", "1fr auto auto"]}
        templateRows={["auto auto", "1fr"]}
        zIndex={3}
      >
        <InputGroup
          flex="1"
          endElement={
            query.length > 0 ? (
              <CloseButton
                borderRadius="12px"
                left="0.6rem"
                onClick={() => {
                  setQuery("");
                }}
              />
            ) : null
          }
        >
          <Input
            borderRadius="12px"
            aria-label="Search Bluesky users"
            background="white"
            placeholder="Who are you looking for?"
            size="lg"
            type="text"
            value={query}
            onInput={(e) =>
              setQuery((e.target as HTMLInputElement).value.toLocaleLowerCase())
            }
          />
        </InputGroup>

        <Button
          aria-expanded={showFilters}
          aria-label={showFilters ? "Hide filters" : "Show filters"}
          aspectRatio="1"
          background="white"
          borderRadius="12px"
          ref={filtersButtonRef}
          id="filters-button"
          size="lg"
          variant="outline"
          onClick={() => setShowFilters((state) => !state)}
        >
          <LuFilter size="lg" />
        </Button>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              aria-controls="filters-button"
              className="filters-card"
              initial={{
                opacity: 0,
                y: -40,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -40,
                transition: {
                  ease: "easeOut",
                  duration: 0.2,
                },
              }}
              onKeyDown={handleKeyDown}
            >
              <Card.Root mt="2" pt="0" size="sm">
                <Card.Body>
                  <Stack
                    direction={["column", "row"]}
                    gap={["4", "6"]}
                    alignItems="stretch"
                  >
                    <Box>
                      <Text fontWeight="semibold" textStyle="md">
                        Search within
                      </Text>
                      <Stack direction="column" gap="1" pt="2">
                        <Checkbox
                          checked={formOptions.name}
                          size="sm"
                          ref={firstFilterElementRef}
                          onCheckedChange={() =>
                            updateFormOptions({ name: !formOptions.name })
                          }
                        >
                          Name/Handle
                        </Checkbox>
                        <Checkbox
                          checked={formOptions.description}
                          size="sm"
                          onCheckedChange={() =>
                            updateFormOptions({
                              description: !formOptions.description,
                            })
                          }
                        >
                          Bio
                        </Checkbox>
                      </Stack>
                    </Box>
                    <Flex minHeight="inherit" alignItems="stretch">
                      <Separator orientation={["horizontal", "vertical"]} />
                    </Flex>
                    <Box>
                      <Field
                        errorText="Away with your tricks!"
                        fontWeight="semibold"
                        helperText={!formError && "Separate words with commas"}
                        invalid={formError}
                        label="Omit"
                        textStyle="sm"
                      >
                        <Input
                          id="search-input"
                          placeholder="e.g. x.com, bot"
                          size="xs"
                          onChange={handleOmitChange}
                        />
                      </Field>
                    </Box>
                  </Stack>
                </Card.Body>
              </Card.Root>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          borderRadius="12px"
          disabled={loading || formError}
          gridColumn={["1 / -1", "auto"]}
          loading={loading}
          size="lg"
          onClick={() => setShowFilters(false)}
          type="submit"
        >
          Search
        </Button>
      </Grid>
    </Box>
  );
};
