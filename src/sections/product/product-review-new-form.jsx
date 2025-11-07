import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormHelperText from '@mui/material/FormHelperText';

import { useTranslate } from 'src/locales';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function ProductReviewNewForm({ onClose, ...other }) {
  const { t } = useTranslate();

  const ReviewSchema = Yup.object().shape({
    rating: Yup.number().min(1, t('rating_must_be_greater')),
    review: Yup.string().required(t('review_required')),
    name: Yup.string().required(t('name_required')),
    email: Yup.string().required(t('email_required')).email(t('email_must_be_valid')),
  });

  const defaultValues = {
    rating: 0,
    review: '',
    name: '',
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(ReviewSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      onClose();
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const onCancel = useCallback(() => {
    onClose();
    reset();
  }, [onClose, reset]);

  return (
    <Dialog onClose={onClose} {...other}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{t('add_review')}</DialogTitle>

        <DialogContent>
          <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1.5}>
            <Typography variant="body2">{t('your_review_about_this_product')}</Typography>

            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <Rating
                  {...field}
                  size="small"
                  value={Number(field.value)}
                  onChange={(event, newValue) => {
                    field.onChange(newValue);
                  }}
                />
              )}
            />
          </Stack>

          {!!errors.rating && <FormHelperText error> {errors.rating?.message}</FormHelperText>}

          <RHFTextField name="review" label={`${t('review_label')} *`} multiline rows={3} sx={{ mt: 3 }} />

          <RHFTextField name="name" label={`${t('name_label')} *`} sx={{ mt: 3 }} />

          <RHFTextField name="email" label={`${t('email_label')} *`} sx={{ mt: 3 }} />
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onCancel}>
            {t('cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {t('post')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

ProductReviewNewForm.propTypes = {
  onClose: PropTypes.func,
};
