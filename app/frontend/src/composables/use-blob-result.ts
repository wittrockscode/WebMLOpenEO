import { ref, type Ref } from "vue";

const result: Ref<Blob | null> = ref(null);
const class_map: Ref<string[]> = ref([]);
const model_id: Ref<string | null> = ref(null);
const is_demo: Ref<boolean> = ref(false);

export const useBlobResult = () => {
  const setResult = (res: Blob) => {
    result.value = res;
  };

  const setClassMap = (res: string[]) => {
    class_map.value = res;
  };

  const setModelId = (id: string) => {
    model_id.value = id;
  };

  const setIsDemo = (demo: boolean) => {
    is_demo.value = demo;
  };

  return { result, class_map, model_id, is_demo, setResult, setClassMap, setModelId, setIsDemo };
};
