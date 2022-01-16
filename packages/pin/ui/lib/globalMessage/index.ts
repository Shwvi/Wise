/**
 * This is to bind enqueueSnackbar who shows message
 */

import { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";
type Snackbar = (
  message: SnackbarMessage,
  options?: OptionsObject | undefined
) => SnackbarKey;
let enqueueSnackbar: Snackbar | null = null;

export function bindSnackbar(cb: Snackbar) {
  enqueueSnackbar = cb;
}
export function getSnackbar(): Snackbar | null {
  return enqueueSnackbar;
}
