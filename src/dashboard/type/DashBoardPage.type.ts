export interface CardData {
    title: string;
    count: string;
    description: string;
    icon: string;
    iconBgColor: string;
    iconTextColor: string;
    countColor: string;
}

export interface BookClub {
    id: string;
    title: string;
    createdAt: string;
    memberCount: number;
}

export interface BookReview {
    id: string;
    title: string;
    content: string;
    author: string;
    commentCount: number;
    likeCount: number;
}

export interface recencyReply {
    id: string;
    content: string;
    author: string;
    timestamp: string;
}