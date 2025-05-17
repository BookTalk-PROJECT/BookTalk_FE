// 모임 카드 타입 정의
export interface HighlightCard {
  title: string;
  count: number;
  description: string;
  icon: string;
  iconColor: string;
  textColor: string;
}

// 최신 모임 타입 정의
export interface RecentGatherings {
  title: string;
  createdAt: string;
  members: number;
}

// 최신 게시글 타입 정의
export interface RecentPost {
  title: string;
  content: string;
  author: string;
  comments: number;
  likes: number;
}

// 최신 댓글 타입 정의
export interface RecentReply {
  content: string;
  author: string;
  createdAt: string;
}

// 차트 타입 정의
export interface ChartConfig {
  id: string;
  title: string;
  color: string;
  data: number[];
}
