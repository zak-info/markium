import { t } from "i18next";
import { enqueueSnackbar } from "notistack";

export default function showError(error) {
  console.log("error : ", error)
  if (error?.data) {
    // Object.values(error?.data).forEach(array => {
      // array.forEach(text => {
      //   enqueueSnackbar(text, { variant: 'error' });
      // });
      enqueueSnackbar(Object.values(error?.data)[0][0], { variant: 'error' });
    // });
  } else if (error?.message) {
    enqueueSnackbar(error?.message, { variant: 'error' });
  } else {
    enqueueSnackbar(t('operation_failed'), { variant: 'error' });
  }
}

