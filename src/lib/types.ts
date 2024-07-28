export interface MessageWAuthor {
  id: number;
  userId: number;
  content: string;
  time: Date;
  author: {
    id: number;
    name: string;
  };
}

export interface MessageWACD {
  id: number;
  content: string;
  time: Date;
  author: {
    id: number;
    name: string;
  };
  onCooldown: boolean;
}

export interface Statistics {
  userId: number;
  username: string;
  totalMessages: number;
  totalFetches: number;
  totalAverageMessagesPerFetch: number;
  totalFetchesNoCooldown: number;
}

export interface User {
  id: number;
  name: string;
  totalFetches: number;
}
