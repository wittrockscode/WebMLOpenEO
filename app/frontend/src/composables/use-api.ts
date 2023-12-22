export const useApi = () => {

  let NODE_URL = "";

  if(import.meta.env.VITE_ENV === "production") {
    NODE_URL = import.meta.env.VITE_NODE_BACKEND_URI ?? "http://http://ec2-54-70-150-226.us-west-2.compute.amazonaws.com/api";
  } else {
    NODE_URL = import.meta.env.VITE_NODE_BACKEND_URI_CONTAINER ?? "http://localhost:3000/api";
  }

  return { NODE_URL };
};
