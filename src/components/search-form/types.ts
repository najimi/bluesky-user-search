import { FormEvent } from "react";

export interface SearchFormProps {
  loading: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: () => void;
}
