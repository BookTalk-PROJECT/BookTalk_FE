export interface Books {
    id: number;
    title: string;
    author: string;
    status: 0 | 1;
    date: string;
}

export interface bookInfo {
    totalMembers: number;
    completeBooks: number;
    weeklyDay: string;
}