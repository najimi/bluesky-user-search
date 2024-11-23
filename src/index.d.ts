export {};

declare global {
  interface Window {
    fathom?: {
      trackEvent: (
        name: string,
        _value: Record<"_value", string | number>
      ) => void;
    };
  }
}
