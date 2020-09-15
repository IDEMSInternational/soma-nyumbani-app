export { IDBEndpoint } from "../app/services/db.service";

export interface IDayMeta {
  title: string;
  sessions: string[];
}
export interface ISessionMeta {
  title: string;
  description: string;
  tags: string[];
  _attachments: {
    [filename: string]: IDBAttachmentStub;
  };
}

/**
 * If a document contains attachments with have not been included in sync,
 * A stubbed field is included
 */
export interface IDBAttachmentStub {
  content_type: string;
  revpos: number;
  digest: string;
  length: number;
  stub: true;
}

/**
 * Base typing for all couchDB docs
 */
export interface IDBDoc {
  _id: string;
  _rev: string;
  _deleted?: boolean;
}
