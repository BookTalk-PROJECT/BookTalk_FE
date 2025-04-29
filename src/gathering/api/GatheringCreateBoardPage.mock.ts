// src/api/youtube.ts
import axios from 'axios';
import { PostData, YoutubeVideo } from '../type/GatheringCreateBoardPage.type';

const API_BASE_URL = "http://localhost:8080/api/gatherings";

const RESULTS_PER_PAGE = 5;

export const createPost = async (postData: PostData) => {
    const response = await axios.post('/api/posts', postData);
    return response.data;
};


export const searchYoutubeVideos = async (query: string, pageToken: string | number = '') => {
    if (!query) return { items: [], nextPageToken: '', prevPageToken: '', totalResults: 0 };

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
            part: 'snippet',
            q: query,
            type: 'video',
            key: import.meta.env.VITE_YOUTUBE_API_KEY,
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
