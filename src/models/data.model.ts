import { IDBAttachmentStub } from "./db.model";

export interface IDayMeta {
  title: string;
  sessions: string[];
}
export interface ISessionMeta {
  title: string;
  description: string;
  slug: string;
  day_number: number;
  session_number: number;
  session_outline: any;
  // custom attachments entry to keep non-binary attachment stub
  attachments?: { [filename: string]: IDBAttachmentStub };
  type: "Session Guide";
  areas_involved: {
    [topic: string]: {
      [subtopic: string]: number;
    };
  };
}

export const MOCK_SESSION: ISessionMeta = {
  day_number: 5,
  session_number: 17,
  title: "A to Z Workout",
  type: "Session Guide",
  session_outline: {
    session_objectives:
      "<p ><span >The objectives of this session are to:</span></p><ul ><li ><span >Learn a wide range of exercises that can be carried out while maintaining social distancing.</span></li><li ><span >Carry out a series of exercises in a fun and engaging way.</span></li></ul>",
    expected_outcomes:
      "<p ><span >By the end of the session learners will have:</span></p><ul ><li ><span >Learned and understood how to carry out 26 different exercises.</span></li><li ><span >Created sequences of exercises for them and their peers to carry out.</span></li><li ><span >Practiced English skills by spelling words with exercises and figuring out what word other learners&rsquo; exercises spell.</span></li></ul>",
  },
  description:
    "<p ><span >This session presents 26 physical exercises, each one assigned to a letter in the alphabet. Learners will get an opportunity to gain a sensible understanding of each exercise and then produce a short sequence of exercises that spell out a word for the group to carry out. It also aims to provide a comprehensive list of exercises that learners can do at home.</span></p>",
  slug: "a-to-z-workout",
  areas_involved: {
    mathematics_and_financial_literacy: {
      math_brain_teasers: 1,
      the_number_system: 2,
    },
    environment: { careers_in_science: 3 },
    life_skills: { "self-esteem": 4 },
  },
};
