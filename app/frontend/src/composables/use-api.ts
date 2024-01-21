import axios from "axios";
import type { Req } from "@/types/api";

export const useApi = () => {
  let NODE_URL = "";

  if(import.meta.env.VITE_ENV === "production") {
    NODE_URL = import.meta.env.VITE_NODE_BACKEND_URI ?? "http://http://ec2-54-70-150-226.us-west-2.compute.amazonaws.com/api";
  } else {
    NODE_URL = import.meta.env.VITE_NODE_BACKEND_URI_CONTAINER ?? "http://localhost:3000/api";
  }

  const classify_request = async (payload: Req.Classify.Payload) => {
    const response = await axios.post(`${NODE_URL}/classify`, payload);

    return response.data;
  };

  const sentinel_img_request = async (payload: Req.Sentinel.Payload) => {
    const response = await axios.post<Req.Sentinel.Response>(`${NODE_URL}/getsentinelimg`, payload);

    return response;
  };

  return { NODE_URL, classify_request, sentinel_img_request };
};
