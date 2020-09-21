import { IUserDocBase, USER_DOC_BASE } from "./user.model";
import { v4 as uuidv4 } from "uuid";

/**
 * Data captured during session reports
 */
export interface ISessionReport extends IUserDocBase {
  _draft: boolean;
  _id: string;
  day_number: number;
  session_number: number;
  sessionDate: string;
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
  _id: null,
  _draft: true,
  day_number: 1,
  session_number: 1,
  sessionDate: formatDateForInput(),
  selectedSession: null,
  cohort: "default",
  observations: [],
  photos: [],
  reflections: DEFAULT_REFLECTION_QUESTIONS,
};

// Date inputs expect format yyyy-mm-dd, however when generating using isoString method
// timezone information is lost, so instead generate manually
// take a given date (default local datetime) and format as YYYY-MM-DD
// (pad leading 0s for day and month where necessary)
function formatDateForInput(d = new Date()) {
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  function pad(n) {
    return n < 10 ? "0" + n : n;
  }
}
