export { IDBEndpoint } from "../app/services/db.service";

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
 * Sometimes when working with attachments additional metadata is populated
 */
export interface ICustomAttachment extends IDBAttachmentStub {
  attachmentId: string;
  docId: string;
}

/**
 * Base typing for all couchDB docs
 */
export interface IDBDoc {
  _id: string;
  _rev: string;
  _deleted?: boolean;
  _attachments?: { [filename: string]: IDBAttachmentStub };
}
