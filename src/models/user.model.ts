import { ISessionReport } from "./report.model";

/**
 * Base type for all docs that will be synchronized to a user profile
 */
export interface IUserDocBase {
  _created: string;
  _lastModified: string;
  _lastSync?: string;
}

/**
 * The main user data models consists of base metadata, user metadata (e.g. user id)
 * and nested subcollections for user-generated documents (e.g. session reports)
 */
export type IUser = IUserDocBase & IUserMeta & IUserSubcollections;

export interface IUserMeta extends IUserDocBase {
  activeDay: number;
  role?: "teacher" | "facilitator" | "student";
  uid?: string; // populated by auth on registration
  displayName?: string;
  analyticsConsent?: boolean;
  tutorialComplete?: boolean;
}
export interface IUserSubcollections {
  sessionReports: { [id: string]: ISessionReport };
}

export const DEFAULT_USER: IUser = {
  _created: new Date().toISOString(),
  _lastModified: new Date().toISOString(),
  sessionReports: {},
  activeDay: 1,
};

export const USER_DOC_BASE = (): IUserDocBase => {
  const d = new Date().toISOString();
  return { _created: d, _lastModified: d };
};
