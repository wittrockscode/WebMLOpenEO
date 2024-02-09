import type { ModalIds } from "@/enums";
import type { Nullable } from "@/types/AppTypes";
import type { Ref } from "vue";
import { ref } from "vue";

export const useModal = <T,>(modalId: ModalIds, submit_callback: (payload: Nullable<T>) => void, cancel_callback = () => {}, z_index = 100) => {
  const visible: Ref<Boolean> = ref(false);
  const modal_id: Ref<ModalIds> = ref(modalId);
  const submit_payload: Ref<Nullable<T>> = ref(null);
  const zIndex = ref(z_index);
  const _cancel_callback_arr: (() => void)[] = [];
  const _submit_callback_arr: ((payload: Nullable<T>, identifyier: number) => void)[] = [];
  const _open_callback_arr: ((value?: any) => void)[] = [];
  const __before_submit_callback_arr: (() => boolean)[] = [];

  const cancelFn = () => {
    cancel_callback();
    _cancel_callback_arr.forEach(callback => {
      callback();
    });
    close();
  };
  const submitFn = (identifyier: number = 0) => {
    _submit_callback_arr.forEach(callback => {
      callback(submit_payload.value, identifyier);
    });
    submit_callback(submit_payload.value);
    close();
  };
  const outerClickFn = () => {
    _cancel_callback_arr.forEach(callback => {
      callback();
    });
    close();
  };
  const open = (value: any = null) => {
    if(!visible.value){
      visible.value = true;
      const elem = window.document.getElementById(modalId);
      if(elem) elem.classList.add("visible");
      _open_callback_arr.forEach(callback => callback(value));
    }
  };
  const close = () => {
    if(visible.value){
      visible.value = false;
      const elem = window.document.getElementById(modalId);
      if(elem) elem.classList.remove("visible");
    }
  };

  const setPayload = (payload: Nullable<T>) => {
    submit_payload.value = payload;
  };

  const setZIndex = (zindex: number) => {
    zIndex.value = zindex;
  };

  const onCancel = (callback: () => void) => {
    _cancel_callback_arr.push(callback);
  };

  const onSubmit = (callback: (payload: Nullable<T>, identifyier: number) => void) => {
    _submit_callback_arr.push(callback);
  };

  const onOpen = (callback: (value?: any) => void) => {
    _open_callback_arr.push(callback);
  };

  const beforeSubmit = () => {
    let result = true;
    __before_submit_callback_arr.forEach(callback => {
      result = result && callback();
    });

    if (result) submitFn(0);
  };

  const onBeforeSubmit = (callback: () => boolean) => {
    __before_submit_callback_arr.push(callback);
  };

  return { modal_id, zIndex, cancelFn, submitFn, outerClickFn, open, close, setPayload, onCancel, onSubmit, onOpen, setZIndex, onBeforeSubmit, beforeSubmit };
};