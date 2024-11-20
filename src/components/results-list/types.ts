import { FormOptions } from "@/store";

export interface ResultsListProps {
  loadMore(
    formOptions: FormOptions,
    query: string,
    cursor: string | null
  ): void;
}
