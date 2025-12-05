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
  del_yn: boolean;
  del_reason: string | null;
  reg_date: string;
  update_date: string;
  thumbnail: string;
}

export interface BookReviewCreate {
  book_title: string;
  authors: string;
  publisher: string;
  isbn: string;
  thumbnail_url: string;
  title: string;
  content: string;
  rating: number;
}
