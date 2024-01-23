export const useDemo = () => {
  const _doi_callbacks: (() => void)[] = [];
  const _aoi_callbacks: (() => void)[] = [];
  const _tot_callbacks: (() => void)[] = [];
  const _td_callbacks: (() => void)[] = [];
  const _hyperparams_callbacks: (() => void)[] = [];
  const _resolution_callbacks: (() => void)[] = [];
  const _reset_callbacks: (() => void)[] = [];
  const _finish_callbacks: (() => void)[] = [];
  const selectDoi = () => {
    _doi_callbacks.forEach(callback => callback());
  };
  const selectAoi = () => {
    _aoi_callbacks.forEach(callback => callback());
  };
  const selectTot = () => {
    _tot_callbacks.forEach(callback => callback());
  };
  const selectTd = () => {
    _td_callbacks.forEach(callback => callback());
  };
  const selectHyperparams = () => {
    _hyperparams_callbacks.forEach(callback => callback());
  };
  const selectResolution = () => {
    _resolution_callbacks.forEach(callback => callback());
  };
  const reset = () => {
    _reset_callbacks.forEach(callback => callback());
  };
  const finish = () => {
    _finish_callbacks.forEach(callback => callback());
  };
  const onSelectDoi = (callback: () => void) => {
    _doi_callbacks.push(callback);
  };
  const onSelectAoi = (callback: () => void) => {
    _aoi_callbacks.push(callback);
  };
  const onSelectTot = (callback: () => void) => {
    _tot_callbacks.push(callback);
  };
  const onSelectTd = (callback: () => void) => {
    _td_callbacks.push(callback);
  };
  const onSelectHyperparams = (callback: () => void) => {
    _hyperparams_callbacks.push(callback);
  };
  const onSelectResolution = (callback: () => void) => {
    _resolution_callbacks.push(callback);
  };
  const onReset = (callback: () => void) => {
    _reset_callbacks.push(callback);
  };
  const onFinish = (callback: () => void) => {
    _finish_callbacks.push(callback);
  };

  return {
    selectDoi,
    selectAoi,
    selectTot,
    selectTd,
    selectHyperparams,
    selectResolution,
    reset,
    finish,
    onSelectDoi,
    onSelectAoi,
    onSelectTot,
    onSelectTd,
    onSelectHyperparams,
    onSelectResolution,
    onReset,
    onFinish,
  };
};
