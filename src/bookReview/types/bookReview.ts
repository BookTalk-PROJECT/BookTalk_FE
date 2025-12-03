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
  content: string;
  isbn: string;
  publisher: string;
  authors: string;
  views: number;
  likesCnt: number;
  memberId: number;
  isLiked: boolean;
  notificationYn: boolean;
  delYn: boolean;
  delReason: string | null;
  regDate: string;
  updateDate: string;
}

export interface BookReviewCreate {
  bookTitle: string;
  authors: string;
  publisher: string;
  isbn: string;
  thumbnail: string;
  title: string;
  content: string;
  rating: number;
  notificationYn: boolean;
}

export interface BookReviewUpdate {
  title: string;
  content: string;
  rating: number;
}
