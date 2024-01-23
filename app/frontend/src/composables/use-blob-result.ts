import { ref, type Ref } from "vue";

const result: Ref<Blob | null> = ref(null);
const class_map: Ref<string[]> = ref([]);

export const useBlobResult = () => {
  const setResult = (res: Blob) => {
    result.value = res;
  };

  const setClassMap = (res: string[]) => {
    class_map.value = res;
  };

  return { result, class_map, setResult, setClassMap };
};
