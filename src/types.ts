export interface Binding {
  id: string;
  key: string;
  meta: boolean;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  label: string;
  menuItem: string;
}

export interface Settings {
  enabled: boolean;
  menuName: string;
  showToast: boolean;
  sheetsOnly: boolean;
  bindings: Binding[];
}

export type MessageType =
  | { type: "getSettings" }
  | { type: "saveSettings"; settings: Settings }
  | { type: "resetSettings" }
  | { type: "settingsUpdated"; settings: Settings };
