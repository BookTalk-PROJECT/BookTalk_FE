export interface BookReview {
  code: string;
  book_title: string;
  review_title: string;
  author: string;
  rating: number;
  thumbnail_url: string;
  reg_date: string;
}

export interface BookReviewDetail extends BookReview {
  categoryId: string;
  title: string;
  content: string;
  authors: string;
  views: number;
  likes_cnt: number;
  member_id: number;
  isLiked: boolean;
  del_yn: boolean;
  del_reason: string | null;
  reg_date: string;
  update_date: string;
  publisher: string;
  isbn: string;
}

export interface BookReviewCreate {
  categoryId: string;
  book_title: string;
  authors: string;
  publisher: string;
  isbn: string;
  thumbnail_url: string;
  title: string;
  content: string;
  rating: number;
}
