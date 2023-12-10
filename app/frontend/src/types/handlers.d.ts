export type ModalHandler = {
  modal_id: import("vue").Ref<import("@/enums").ModalIds | null>;
  cancelFn: () => void;
  submitFn: () => void;
  outerClickFn: () => void;
  open: () => void;
  close: () => void;
  submit: (payload: Object) => Object;
};
