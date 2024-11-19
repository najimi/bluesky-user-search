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
import { SearchFormProps } from "./types";

export const SearchForm = ({ loading, onChange }: SearchFormProps) => {
  return <div>index</div>;
};
