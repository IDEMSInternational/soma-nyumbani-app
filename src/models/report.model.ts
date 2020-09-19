import { IUserDocBase, USER_DOC_BASE } from "./user.model";

/**
 * Data captured during session reports
 */
export interface ISessionReport extends IUserDocBase {
  selectedSession: string | null;
  cohort: string;
  observations: ISessionObservation[];
  reflections: ISessionReflection[];
  photos: any[];
}

interface ISessionObservation {
  observation: string;
}
interface ISessionReflection {
  prompt: string;
  response?: string;
}

export const DEFAULT_REFLECTION_QUESTIONS: ISessionReflection[] = [
  { prompt: "What was useful about this session?" },
  {
    prompt:
      "What constructive observations do you have that could lead to improvements in the future?",
  },
  { prompt: "Other comments" },
];

export const DEFAULT_REPORT: ISessionReport = {
  ...USER_DOC_BASE(),
  selectedSession: null,
  cohort: "default",
  observations: [],
  photos: [],
  reflections: DEFAULT_REFLECTION_QUESTIONS,
};
