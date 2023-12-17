import type { Req } from "@/types/api";
import axios from "axios";

export const useApi = () => {

  const NODE_URL = import.meta.env.VITE_NODE_BACKEND_URI ?? "http://localhost:3000/api";

  const test = async (payload: Req.Classify.Payload) => {
    const response = await axios.post(`${NODE_URL}/test`, payload);

    return response.data;
  };

  const pre_release_request = async (payload: Req.PreRelease.Payload) => {
    const response = await axios.post(`${NODE_URL}/preRelease`, payload, { responseType: "blob" });

    return response;
  };

  return { test, pre_release_request };
};
