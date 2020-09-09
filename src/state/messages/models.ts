export type MessageConfig = {
  id?: string;
  color: string;
  message: React.ReactNode | string;
  dismissible?: boolean;
  shouldBeAutoDismissed?: boolean;
};

export type Message = {
  id: string;
  dismissedAtMs: number | null;
} & MessageConfig;
