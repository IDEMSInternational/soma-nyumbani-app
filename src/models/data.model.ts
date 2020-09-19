import { IDBAttachmentStub } from "./db.model";

export interface IDayMeta {
  title: string;
  sessions: string[];
}
export interface ISessionMeta {
  title: string;
  description: string;
  tags: string[];
  // custom attachments entry to keep non-binary attachment stub
  attachments?: { [filename: string]: IDBAttachmentStub };
}
