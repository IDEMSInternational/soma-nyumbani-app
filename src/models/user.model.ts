import { ISessionReport } from "./report.model";

/**
 * Base type for all docs that will be synchronized to a user profile
 */
export interface IUserDocBase {
  _created: string;
  _last_modified: string;
  _last_sync?: string;
}

export interface IUser extends IUserDocBase {
  activeDay: number;
  role?: "teacher" | "facilitator" | "student";
  uid?: string; // populated by auth on registration
  analyticsConsent?: boolean;
  tutorialComplete?: boolean;
  sessionReports: ISessionReport[];
}

export const DEFAULT_USER: IUser = {
  _created: new Date().toISOString(),
  _last_modified: new Date().toISOString(),
  sessionReports: [],
  activeDay: 1,
};

export const USER_DOC_BASE = (): IUserDocBase => {
  const d = new Date().toISOString();
  return { _created: d, _last_modified: d };
};
