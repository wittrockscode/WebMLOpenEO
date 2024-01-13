import type { ModalIds } from "@/enums";
import type { ModalHandler, SubmitPayload } from "@/types/AppTypes";
import type { Ref } from "vue";
import { ref } from "vue";

export const useModal = (modalId: ModalIds, submit_callback: (payload: SubmitPayload) => void, cancel_callback = () => {}): ModalHandler => {
  const visible: Ref<Boolean> = ref(false);
  const modal_id: Ref<ModalIds> = ref(modalId);
  const submit_payload: Ref<SubmitPayload> = ref(null);
  const _cancel_callback_arr: (() => void)[] = [];
  const _submit_callback_arr: ((payload: SubmitPayload, identifyier: number) => void)[] = [];
  const _open_callback_arr: (() => void)[] = [];

  const cancelFn = () => {
    cancel_callback();
    _cancel_callback_arr.forEach(callback => {
      callback();
    });
    close();
  };
  const submitFn = (identifyier: number = 0) => {
    submit_callback(submit_payload.value);
    _submit_callback_arr.forEach(callback => {
      callback(submit_payload.value, identifyier);
    });
    close();
  };
  const outerClickFn = () => {
    _cancel_callback_arr.forEach(callback => {
      callback();
    });
    close();
  };
  const open = () => {
    if(!visible.value){
      visible.value = true;
      const elem = window.document.getElementById(modalId);
      if(elem) elem.classList.add("visible");
      _open_callback_arr.forEach(callback => callback());
    }
  };
  const close = () => {
    if(visible.value){
      visible.value = false;
      const elem = window.document.getElementById(modalId);
      if(elem) elem.classList.remove("visible");
    }
  };

  const setPayload = (payload: SubmitPayload) => {
    submit_payload.value = payload;
  };

  const onCancel = (callback: () => void) => {
    _cancel_callback_arr.push(callback);
  };

  const onSubmit = (callback: (payload: SubmitPayload, identifyier: number) => void) => {
    _submit_callback_arr.push(callback);
  };

  const onOpen = (callback: () => void) => {
    _open_callback_arr.push(callback);
  };

  return { modal_id, cancelFn, submitFn, outerClickFn, open, close, setPayload, onCancel, onSubmit, onOpen };
};