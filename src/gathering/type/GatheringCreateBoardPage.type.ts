export interface YoutubeVideo { // 유튜브 검색 api 타입
    id: string;
    title: string;
    thumbnail: string;
    channelTitle: string;
    publishedAt: string;
}

export interface PostData { //게시글 등록 시 입력되는 데이터 타입
    title: string;
    category: string;
    content: string;
}
