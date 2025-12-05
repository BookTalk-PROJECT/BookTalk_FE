export interface BookReview {
  code: string;
  book_title: string;
  review_title: string;
  author: string;
  publication_date: string;
  rating: number;
  thumbnail_url: string;
}

export interface BookReviewDetail extends BookReview {
  title: string;
  content: string;
  isbn: string;
  publisher: string;
  authors: string;
  views: number;
  likes_cnt: number;
  member_id: number;
  isLiked: boolean;
  notification_yn: boolean;
  del_yn: boolean;
  del_reason: string | null;
  reg_date: string;
  update_date: string;
}

export interface BookReviewCreate {
  book_title: string;
  authors: string;
  publisher: string;
  isbn: string;
  thumbnail: string;
  title: string;
  content: string;
  rating: number;
  notification_yn: boolean;
}

export interface BookReviewUpdate {
  title: string;
  content: string;
  rating: number;
}
