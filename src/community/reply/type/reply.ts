export interface ReplyRequest {
  postCode: string;
  content: string;
  parentReplyCode?: string | null;
}
