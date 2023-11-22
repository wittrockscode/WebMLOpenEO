import type { ModalIds } from "@/enums";
import type { Ref } from "vue";
import { ref } from "vue";

export const useModal = (modalId: ModalIds): ModalHandler => {
  const visible: Ref<Boolean> = ref(false);
  const modal_id: Ref<ModalIds> = ref(modalId);
  const cancelFn = () => {
    close();
  };
  const submitFn = () => {
    close();
  };
  const outerClickFn = () => {
    close();
  };
  const open = () => {
    if(!visible.value){
      visible.value = true;
      const elem = window.document.getElementById(modalId);
      if(elem) elem.classList.add("visible");
    }
  };
  const close = () => {
    if(visible.value){
      visible.value = false;
      const elem = window.document.getElementById(modalId);
      if(elem) elem.classList.remove("visible");
    }
  };
  const submit = (payload: Object) => {
    close();
    return payload;
  };

  return { modal_id, cancelFn, submitFn, outerClickFn, open, close, submit };
};