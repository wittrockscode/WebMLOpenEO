import { ref, type Ref } from "vue";

const result: Ref<Blob | null> = ref(null);

export const useBlobResult = () => {
  const setResult = (res: Blob) => {
    result.value = res;
  };

  return { result, setResult };
};
