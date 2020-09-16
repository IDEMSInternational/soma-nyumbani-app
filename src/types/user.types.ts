export interface IUser {
  activeDay: number;
  role?: "teacher" | "facilitator" | "student";
  uid?: string; // populated by auth on registration
  analyticsConsent?: boolean;
  tutorialComplete?: boolean;
}

export const DEFAULT_USER: IUser = {
  activeDay: 1,
};
