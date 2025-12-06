export type RowDef<T> = {
  label: string;
  key: Extract<keyof T, string>;
  isSortable: boolean;
  isSearchType: boolean;
};
export type SearchType = "board_code" | "title" | "author" | "category" | "book_title" | "isbn"; // Added book_title and isbn

export interface SearchCondition {
  keywordType: SearchType;
  keyword: string;
  startDate: string;
  endDate: string;
}
