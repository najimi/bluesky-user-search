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

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CloseButton } from "@/components/ui/close-button";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { LuFilter } from "react-icons/lu";
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
      <Grid
        pt="4"
        gap="6px"
        templateColumns={["1fr auto", "1fr auto auto"]}
        templateRows={["auto auto", "1fr"]}
      >
        <InputGroup
          flex="1"
          endElement={
            <CloseButton
              left="0.6rem"
              onClick={() => {
                setQuery("");
              }}
            />
          }
        >
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
        </InputGroup>
        <Button
          aria-label="Show filters"
          size="lg"
          variant="outline"
          aspectRatio="1"
        >
          <LuFilter size="lg" />
        </Button>
        <Button
          size="lg"
          type="submit"
          loading={loading}
          disabled={loading || formError}
          gridColumn={["1 / -1", "auto"]}
        >
          Search
        </Button>
      </Grid>

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
