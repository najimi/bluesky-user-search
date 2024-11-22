import {
  Box,
  Card,
  Flex,
  HStack,
  Input,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { useState } from "react";
import { useStore } from "@/store";

export const SearchForm = () => {
  const [formError, setFormError] = useState(false);
  const { formOptions, loading, setQuery, query, updateFormOptions } =
    useStore();

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

  return (
    // Extra Padding here accounting for focus rings
    <Box paddingLeft="4px" paddingRight="4px">
      <HStack justify="center" alignItems="flex-end" pt="4">
        <Input
          aria-label="Search Bluesky users"
          placeholder="Who are you looking for?"
          type="text"
          value={query}
          size="lg"
          onInput={(e) =>
            setQuery((e.target as HTMLInputElement).value.toLocaleLowerCase())
          }
        />

        <Button
          size="lg"
          type="submit"
          loading={loading}
          disabled={loading || formError}
        >
          Search
        </Button>
      </HStack>

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
                  size="sm"
                  checked={formOptions.name}
                  onCheckedChange={() =>
                    updateFormOptions({ name: !formOptions.name })
                  }
                >
                  Name/Handle
                </Checkbox>
                <Checkbox
                  size="sm"
                  checked={formOptions.description}
                  onCheckedChange={() =>
                    updateFormOptions({ description: !formOptions.description })
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
                invalid={formError}
                label="Omit"
                fontWeight="semibold"
                textStyle="sm"
                helperText={!formError && "Separate words with commas"}
                errorText="Away with your tricks!"
              >
                <Input
                  id="search-input"
                  size="xs"
                  placeholder="e.g. x.com, bot"
                  onChange={handleOmitChange}
                />
              </Field>
            </Box>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Box>
  );
};
