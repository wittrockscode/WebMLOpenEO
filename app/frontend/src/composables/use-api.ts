import type { Request } from "@/types/api";
import axios from "axios";

export const useApi = () => {

  const NODE_URL = import.meta.env.VITE_NODE_BACKEND_URI;

  const test = async (payload: Request.Classify.Payload) => {
    const response = await axios.post(`${NODE_URL}/test`, payload);

    return response.data;
  };

  return { test };
};
