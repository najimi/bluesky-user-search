import { Actor } from "@/types";

export interface ResultsListProps {
  loading: boolean;
  loadMore?: () => void;
  results: Actor[];
}
