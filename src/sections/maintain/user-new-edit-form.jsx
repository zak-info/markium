import * as Yup from 'yup';
import PropTypes, { number } from 'prop-types';
import { useMemo, useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { countries } from 'src/assets/data';

import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFSelect,
  RHFAutocomplete,
} from 'src/components/hook-form';

import { useTranslate } from 'src/locales';
import { useValues } from 'src/api/utils';

import { createMaintenance, editMaintenance } from 'src/api/maintainance';
import { fDate } from 'src/utils/format-time';
import { useGetCar } from 'src/api/car';
import { ListItemText } from '@mui/material';
import { format, subDays } from 'date-fns';
import CarsAutocomplete from 'src/components/hook-form/rhf-CarsAutocomplete';
import { useSearchParams } from 'react-router-dom';
import showError from 'src/utils/show_error';
import { useGetSystemVisibleItem } from 'src/api/settings';
import showValidationError from 'src/utils/show_validation_error';

// ----------------------------------------------------------------------

export default function UserNewEditForm({ currentMentainance }) {
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const { car } = useGetCar()
  const { data } = useValues();
  const { items: states } = useGetSystemVisibleItem("state")

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const NewUserSchema = Yup.object({
    maintainance_type: Yup.string().required(t("maintenance_type_is_required")),
    car_id: Yup.number().required(t("car_is_required")),
    entry_date: Yup.date().required(t("entry_date_is_required")),
    cause: Yup.string()
      .required(t("cause_is_required"))
      .matches(/^[\u0600-\u06FFa-zA-Z][\u0600-\u06FFa-zA-Z\s]*$/, t("cause_format_invalid"))
      .trim(),
    exit_date: Yup.date().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      state_id: null, // default value for state_id
      car_id: searchParams.get("car_id") || "", // default value for car plate number
      maintainance_type: '', // default value for car plate number
      entry_date: format(subDays(new Date(), 1), "yyyy-MM-dd"), // default value for entry date
      cause: '', // default value for cause
      exit_date: format(new Date(), 'yyyy-MM-dd'), // default value for exit date (empty string)
    }),
    [currentMentainance]
  );
  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
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


  useEffect(() => {
    showValidationError(errors)
  }, [errors]);


  const values = watch();

  useEffect(() => {
    if (currentMentainance?.id) {
      setValue('car_plat_number', currentMentainance?.car?.plat_number);
      setValue('car_id', currentMentainance?.car?.id);
      setValue('maintainance_type', currentMentainance?.maintainance_type);
      setValue('cause', currentMentainance?.cause);
      setValue('entry_date', currentMentainance?.entry_date ? new Date(currentMentainance?.entry_date) : new Date());
      setValue('exit_date', currentMentainance?.exit_date ? new Date(currentMentainance?.exit_date) : new Date());
      setValue('state_id', currentMentainance?.state_id);
    }

    // const car_id = searchParams.get("car_id");
    // if (car_id) {
    //   // setValue('car_id', car?.find(item => item.id == car_id)?.id);
    //   setValue('car_id',car_id,{ shouldValidate: true });
    // }
  }, [currentMentainance, setValue]);



  const onSubmit = handleSubmit(async (data) => {
    try {
      let body = data
      body.entry_date = format(new Date(data.entry_date), 'yyyy-MM-dd')
      body.exit_date = format(new Date(data.exit_date), 'yyyy-MM-dd')

      console.log("lets do it now ");
      console.log("body : body: ", body);
      const response = currentMentainance?.id ? await editMaintenance(currentMentainance?.id, body) : await createMaintenance(body);
      enqueueSnackbar(t("operation_success"));
      router.push(paths.dashboard.maintenance.root);
      console.info('DATA', body);
    } catch (error) {
      showError(error)
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              {
                searchParams.get("car_id") ?
                  <Typography>
                    {car?.find(i => i.id == searchParams.get("car_id"))?.plat_number}
                  </Typography>
                  :
                  <CarsAutocomplete required options={car.filter(item => item?.status?.key != "under_maintenance")} name="car_id" label={t('car')} placeholder={t('search_by') + " " + t('plateNumber')} car_id={searchParams.get("car_id")} disabled={searchParams.get("car_id") ? true : false} />
              }


              <DatePicker
                label={t('entryDate')}
                value={values.entry_date ? new Date(values.entry_date) : new Date()}
                required
                name="entry_date"
                format="yyyy/MM/dd"
                onChange={(newValue) => setValue('entry_date', fDate(newValue, "yyyy-MM-dd"))}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />

              {/* allaow  يكون حقل invoice.0 ملفًا من نوع: jpg, jpeg, png, pdf, doc, docx. */}


              <DatePicker
                label={t('exitDate')}
                value={values.exit_date ? new Date(values.exit_date) : new Date()}
                name="exit_date"
                onChange={(newValue) => setValue('exit_date', fDate(newValue, "yyyy-MM-dd"))}
                format="yyyy/MM/dd"
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              // minDate={new Date()}
              />

              <RHFSelect required name="state_id" label={t('workSite')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.states?.filter(i => i.system_settings?.is_selected)?.map((option) => (
                  <MenuItem key={option?.id} value={option?.id}>
                    {option?.translations[0]?.name}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField
                required
                name="cause"
                label={t('cause')}
                error={
                  !values.cause ? false : !/^[\u0600-\u06FFa-zA-Z][\u0600-\u06FFa-zA-Z\s]*$/.test(values.cause)
                }
                helperText={
                  !values.cause
                    ? null
                    : !/^[\u0600-\u06FFa-zA-Z][\u0600-\u06FFa-zA-Z\s]*$/.test(values.cause)
                      ? t('cause_must_start_with_letter_and_contain_only_letters_and_spaces')
                      : ''
                }
              />

              <RHFSelect required name="maintainance_type" label={t('maintainType')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.maintenance_type_enum?.map((option) => (
                  <MenuItem key={option?.key} value={option?.key}>
                    {option?.translations[0]?.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              {/* <RHFAutocomplete
                name="country"
                type="country"
                label={t('manufacturingYear')}
                fullWidth
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              /> */}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentMentainance ? t('addNewMaintain') : t('save_change')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

UserNewEditForm.propTypes = {
  currentMentainance: PropTypes.object,
};
