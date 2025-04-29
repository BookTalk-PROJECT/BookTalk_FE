// src/api/youtube.ts
import axios from 'axios';
import { PostData, YoutubeVideo } from '../type/GatheringCreateBoardPage.type';

//공통 url
const apiKey = import.meta.env.API_KEY;
const youtubeKey = import.meta.env.VITE_YOUTUBE_API_KEY;

const RESULTS_PER_PAGE = 5;

//게시글 등록 api
export const createPost = async (postData: PostData) => {
    const response = await axios.post(apiKey + "/api/gatherings", postData);
    return response.data;
};

//유튜브 api 요청
export const searchYoutubeVideos = async (query: string, pageToken: string | number = '') => {
    if (!query) return { items: [], nextPageToken: '', prevPageToken: '', totalResults: 0 };

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
            part: 'snippet',
            q: query,
            type: 'video',
            key: youtubeKey,
            maxResults: RESULTS_PER_PAGE,
            pageToken: pageToken ? String(pageToken) : undefined,
        },
    });

    const items: YoutubeVideo[] = response.data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
    }));

    return {
        items,
        nextPageToken: response.data.nextPageToken || '',
        prevPageToken: response.data.prevPageToken || '',
        totalResults: response.data.pageInfo.totalResults || 0,
    };
};
