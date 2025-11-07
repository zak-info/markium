import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';
import { useTranslate } from 'src/locales';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFUpload,
} from 'src/components/hook-form';
import showError from 'src/utils/show_error';
import { uploadProductImages } from 'src/api/product';

// ----------------------------------------------------------------------

export default function ProductUploadAssetsForm({ currentProduct }) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();

  const UploadAssetsSchema = Yup.object().shape({
    images: Yup.array().min(1, t('images_is_required')),
  });

  const defaultValues = useMemo(
    () => ({
      images: [],
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(UploadAssetsSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();

      // Append images (files) as array
      if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
          formData.append('files[]', image);
        });
      }

      console.info('FormData entries:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }

      // Upload additional images to the product
      console.log(" currentProduct,",currentProduct);
      await uploadProductImages(currentProduct.id, formData);

      enqueueSnackbar(t('upload_success'));
      reset(); // Reset form after successful upload
      router.push(paths.dashboard.product.details(currentProduct.id));
    } catch (error) {
      console.log("error error ", error);
      showError(error.error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', []);
  }, [setValue]);

  const renderDetails = (
    <>
      <Grid xs={12} md={10}>
        <Card>
          {!mdUp && <CardHeader title={t('upload_assets')} />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {t('product_name')}: {currentProduct?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t('upload_additional_images_description')}
              </Typography>
            </Box>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">{t('images')}</Typography>
              <RHFUpload
                multiple
                thumbnail
                name="images"
                maxSize={31457210}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={10} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
        <LoadingButton
          variant="outlined"
          size="large"
          onClick={() => router.push(paths.dashboard.product.details(currentProduct.id))}
        >
          {t('cancel')}
        </LoadingButton>
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {t('upload_images')}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}

ProductUploadAssetsForm.propTypes = {
  currentProduct: PropTypes.object,
};
