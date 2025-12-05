import axios from "axios";
import { GatheringDetailResponse } from "../type/GatheringEditPage.types";
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getGatheringDetail = async (code: string): Promise<GatheringDetailResponse> => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.get(`${API_BASE_URL}/gathering/${code}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateGathering = async (code: string, formData: FormData) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.put(`${API_BASE_URL}/gathering/modify/${code}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};