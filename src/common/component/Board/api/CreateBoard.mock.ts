import axios from "axios";
import { YoutubeVideo } from "../type/BoardDetail.types";


const apiKey = import.meta.env.BASE_URL;
const youtubeKey = import.meta.env.VITE_YOUTUBE_API_KEY;

const RESULTS_PER_PAGE = 5;

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