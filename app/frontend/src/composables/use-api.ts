import axios from "axios";
import type { Req } from "@/types/api";

export const useApi = () => {
  let NODE_URL = "";

  if(import.meta.env.VITE_ENV === "production") {
    NODE_URL = import.meta.env.VITE_NODE_BACKEND_URI ?? "http://http://ec2-54-70-150-226.us-west-2.compute.amazonaws.com/api";
  } else {
    NODE_URL = import.meta.env.VITE_NODE_BACKEND_URI_CONTAINER ? `${import.meta.env.VITE_NODE_BACKEND_URI_CONTAINER}/api` : "http://localhost:3000/api";
  }

  const classify_request = async (payload: Req.Classify.Payload) => {
    try {
      const response = await axios.post<Req.Classify.Response>(`${NODE_URL}/classify`, payload);
      return response.data;
    } catch (error) {
      return {error: error};
    }
  };

  const sentinel_img_request = async (payload: Req.Sentinel.Payload) => {
    try {
      const response = await axios.post<Req.Sentinel.Response>(`${NODE_URL}/getSentinelImg`, payload, { responseType: "blob" });

      return response.data;
    } catch (error) {
      return {error: error};
    }
  };

  const get_demo_data_request = async () => {
    const response = await axios.get(`${NODE_URL}/getDemoData`);
    return response.data;
  };

  const demo_classify_request = async (payload: Req.Classify.Payload) => {
    try {
      const response = await axios.post(`${NODE_URL}/demoClassify`, payload);
      return response.data;
    } catch (error) {
      return {error: error};
    }
  };

  const get_model_request = async (id: string) => {
    try {
      const response = await axios.get<Req.Model.Response>(`${NODE_URL}/getModel?id=${id}`, { responseType: "arraybuffer", headers: { "Content-Type": "application/rds", "Accept": "application/rds" }});
      return response.data;
    } catch (error) {
      return {error: error};
    }
  };

  const facts_api_request = async () => {
    const response = await axios.get("https://api.api-ninjas.com/v1/facts?limit=20", { headers: { 'X-Api-Key': 'TwmHeksa0xzoVy9fkDsqqg==PW6UiF8lYWw4lRdf'} });
    return response.data;
  };

  return { NODE_URL, classify_request, sentinel_img_request, get_demo_data_request, demo_classify_request, facts_api_request, get_model_request };
};
