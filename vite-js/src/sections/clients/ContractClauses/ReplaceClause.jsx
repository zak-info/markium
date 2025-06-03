import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { format, getTime, formatDistanceToNow } from 'date-fns';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';

import { useLocales, useTranslate } from 'src/locales';

import { addNewDriver, editDriver, useGetDrivers } from 'src/api/drivers';

import { useValues } from 'src/api/utils';
import { useGetCar } from 'src/api/car';
import CarsAutocomplete from 'src/components/hook-form/rhf-CarsAutocomplete';
import SimpleAutocomplete from 'src/components/hook-form/rhf-simple-autocomplete';
import showError from 'src/utils/show_error';
import { cancleContractClause, replaceContractClause } from 'src/api/contract';
import RHFTextarea from 'src/components/hook-form/RHFTextarea';
import { FormGroup } from '@mui/material';

// ----------------------------------------------------------------------

export default function ReplaceClause({ item, currentClause, close }) {
  console.log("item  L",item);

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { car } = useGetCar();
  const { drivers } = useGetDrivers();

  const validationSchema = Yup.object({

  });

  const defaultValues = useMemo(
    () => ({
      cost: Number(currentClause?.cost) || '',

    }),
    [currentClause]
  );



  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();


  const [checked, setChecked] = useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };


  useEffect(() => {
    setValue('cost', Number(item.cost)); // Set the selected car's ID to car_id
    // }

  }, [item, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log("lest edit driver");
      const body = {
        ...data,
        is_urgent: false,
        delay_days: 1,
        cancel_at : format(new Date(values?.cancel_at), 'yyyy-MM-dd')
      };
      console.log("body :", body);
      // reset();
      const responce = await replaceContractClause(item?.id, body)
      enqueueSnackbar(t("operation_success"));
      close()
    } catch (error) {
      showError(error)
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Box
            rowGap={3}
            columnGap={2}
            my={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(1, 1fr)',
            }}
          >

            {
              item?.clauseable_type == "car" ?
                <CarsAutocomplete options={car} name="new_clauseable_id" label={t('car')} placeholder={t("search_by")} />
                : item.clauseable_type == "driver" ?
                  <SimpleAutocomplete options={drivers} name="new_clauseable_id" label={t('drivers')} placeholder={t("search_by")}  />
                  :
                  <RHFSelect disabled={!values.clauseable_type} name="new_clauseable_id" label={t('attachable')}>
                    <Divider sx={{ borderStyle: 'dashed' }} />
                    <MenuItem value={"1"}>
                      {t("name")}
                    </MenuItem>
                  </RHFSelect>
            }

            {/* <RHFTextField name="delay_days" label={t('delay_days')} type={"number"} /> */}
            <RHFTextarea name="reason" label={t('reason')} />
            <DatePicker
              required
              name="cancel_at"
              label={t('date')}
              format="dd/MM/yyyy"
              // value={contract?.cancle_at ? new Date(contract?.cancle_at) : values?.start_date ? new Date(values?.start_date) : new Date()}
              onChange={(date) => setValue('cancel_at', date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />

            {/* <FormGroup>
              <FormControlLabel control={<Switch checked={checked} onChange={handleChange} />} label={t("original_cost")} />
            </FormGroup> */}
            {
              !checked ?
                <RHFTextField name="cost" label={t('cost')} type={"number"} />
                :
                null
            }

          </Box>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {t('saveChange')}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

ReplaceClause.propTypes = {
  currentClause: PropTypes.object,
};
