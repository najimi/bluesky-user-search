export interface Actor {
  did: string;
  handle: string;
  displayName: string;
  avatar: string;
  description?: string;
  createdAt: string;
  indexedAt: string;
}

export interface SearchActorsResponse {
  actors: Actor[];
  cursor?: string;
}
