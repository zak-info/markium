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
import { cancleContractClause, createContractClause, editContractClause, replaceContractClause } from 'src/api/contract';
import RHFTextarea from 'src/components/hook-form/RHFTextarea';
import { FormGroup } from '@mui/material';

// ----------------------------------------------------------------------

export default function AddClauseForm({ setTableData, item, id, currentClause, close, contract }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { car } = useGetCar();
  const { drivers } = useGetDrivers();
  const { currentLang } = useLocales()

  const attachables = [{ name: "car", id: 1, lable: { ar: "سيارة", en: "car" } }, { name: "driver", id: 2, lable: { ar: "سائق", en: "driver" } }]

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
    if(currentClause?.id){
      setValue('clauseable_type', currentClause?.clauseable_type); // Set the selected car's ID to car_id
      setValue('clauseable_id', currentClause?.clauseable_id); // Set the selected car's ID to car_id
      setValue('start_date', new Date(currentClause?.start_date)); // Set the selected car's ID to car_id
      setValue('end_date', new Date(currentClause?.end_date)); // Set the selected car's ID to car_id
      setValue('cost', Number(currentClause.cost)); // Set the selected car's ID to car_id
    }
  }, [currentClause, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let body = { contract_id: id, clauseable_id: data.clauseable_id, clauseable_type: data.clauseable_type, cost: data.cost, start_date: format(new Date(data.start_date), 'yyyy-MM-dd'), end_date: format(new Date(data.end_date), 'yyyy-MM-dd') }
      console.log("body :", body);
      if(currentClause?.id){
        let reqData = {cost: data.cost}
        const responce = await editContractClause(currentClause?.id,reqData);
        setTableData(prev => prev?.map(item => item.id == currentClause?.id ? {...item,...reqData} : item  ))
      }else{
        const responce = await createContractClause(body);
        const item = {
          id: Math.random().toString(), // Or use the returned ID from backend
          clausable: {
            first: data?.clauseable_type == "car" ? car.find(c => c.id == data?.clauseable_id).plat_number : drivers.find(d => d.id == data?.clauseable_id).name, // Or more meaningful info
            second: data?.clauseable_type == "car" ? car.find(c => c.id == data?.clauseable_id).model?.translations[0]?.name : drivers.find(d => d.id == data?.clauseable_id).phone_number, // Or more meaningful info
          },
          cost: data?.cost,
          total_cost: data?.cost, // Or calculate if needed
          status: t('under_rent'), // Or { label: 'New', color: 'primary' } if your table supports label+color
          start_date: format(new Date(data.start_date), 'yyyy-MM-dd'),
          end_date: format(new Date(data.end_date), 'yyyy-MM-dd'),
          color:"success"
        };
        setTableData(prev => [item, ...prev])
      }
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
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(1, 1fr)',
            }}
            sx={{ marginTop: "30px" }}
          >

            <RHFSelect name="clauseable_type" label={t('clause_type')}>
              <Divider sx={{ borderStyle: 'dashed' }} />
              {attachables?.map((type) => (
                <MenuItem key={type?.name} value={type.name}>
                  {type?.lable[currentLang.value]}
                </MenuItem>
              ))}
            </RHFSelect>
            {
              values.clauseable_type == "car" ?
                <CarsAutocomplete options={car} name="clauseable_id" label={t('car')} placeholder={t("search_by")} />
                : values.clauseable_type == "driver" ?
                  <SimpleAutocomplete options={drivers} name="clauseable_id" label={t('drivers')} placeholder={t("search_by")} />
                  :
                  <RHFSelect disabled={!values.clauseable_type} name="clauseable_id" label={t('clause')}>
                    <Divider sx={{ borderStyle: 'dashed' }} />
                    <MenuItem value={"1"}>
                      name
                    </MenuItem>
                  </RHFSelect>
            }
            {/* <RHFTextField name="duration" label={t('duration')} /> */}
            <RHFTextField name="cost" label={t('cost')} type={"number"} />
            <DatePicker
              required
              name="start_date"
              label={t('start_date')}
              format="dd/MM/yyyy"
              value={values?.start_date || new Date()}
              onChange={(date) => setValue('start_date', date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
            <DatePicker
              required
              name="end_date"
              label={t('end_date')}
              format="dd/MM/yyyy"
              value={values?.end_date || new Date()}
              onChange={(date) => setValue('end_date', date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </Box>
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!contract ? t('add') : t('saveChange')}
            </LoadingButton>
          </Stack>


        </Grid>
      </Grid>
    </FormProvider>
  );
}

AddClauseForm.propTypes = {
  currentClause: PropTypes.object,
};
