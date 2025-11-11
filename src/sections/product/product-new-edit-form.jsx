import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';
import { useTranslate } from 'src/locales';

import {
  _tags,
  PRODUCT_SIZE_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_COLOR_NAME_OPTIONS,
} from 'src/_mock';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFSwitch,
  RHFTextField,
  RHFMultiSelect,
  RHFAutocomplete,
  RHFMultiCheckbox,
} from 'src/components/hook-form';
import { createProduct, updateProduct } from 'src/api/product';
import showError from 'src/utils/show_error';
import { useGetSystemCategories } from 'src/api/settings';
import { MenuItem } from '@mui/material';

// ----------------------------------------------------------------------

export default function ProductNewEditForm({ currentProduct }) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();

  const [includeTaxes, setIncludeTaxes] = useState(false);


  const { items: categories } = useGetSystemCategories()

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required(t('name_is_required')),
    images: Yup.array().min(1, t('images_is_required')),
    sale_price: Yup.number().moreThan(0, t('sale_price_required')),
    // not required
    description: Yup.string(),
    content: Yup.string(),
    quantity: Yup.number(),
    category_id: Yup.string(),
    variations: Yup.array(),
    colors: Yup.array(),
    tags: Yup.array(),
    real_price: Yup.number(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      content: currentProduct?.content || '',
      images: currentProduct?.images || [],
      quantity: currentProduct?.quantity || 1,
      category_id: currentProduct?.category_id || '',
      variations: currentProduct?.variations || [],
      colors: currentProduct?.colors || [],
      tags: currentProduct?.tags || [],
      real_price: currentProduct?.real_price || 0,
      sale_price: currentProduct?.sale_price || 0,
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
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

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);


  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();

      // Append basic fields
      formData.append('name', data.name);
      formData.append('description', data.description || '');
      formData.append('content', data.content || '');
      formData.append('quantity', data.quantity || 0);
      formData.append('category_id', data.category_id || '');
      formData.append('real_price', data.real_price || 0);
      formData.append('sale_price', data.sale_price || 0);

      // Append images (files) as array
      if (data.images && data.images.length > 0 && !currentProduct?.id) {
        data.images.forEach((image) => {
          formData.append('images[]', image);
        });
      }

      // Append arrays as separate items (not JSON strings)
      if (data.variations && data.variations.length > 0) {
        data.variations.forEach((variation) => {
          formData.append('variations[]', variation);
        });
      }

      if (data.colors && data.colors.length > 0) {
        data.colors.forEach((color) => {
          formData.append('colors[]', color);
        });
      }

      if (data.tags && data.tags.length > 0) {
        data.tags.forEach((tag) => {
          formData.append('tags[]', tag);
        });
      }

      console.info('FormData entries:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }

      console.log("operateProduct "+ currentProduct?.id ? 'update' : 'create'  );

      await  currentProduct?.id ? updateProduct(currentProduct.id , formData) : createProduct(formData);
      enqueueSnackbar(currentProduct ? t('update_success') : t('create_success'));
      // router.push(paths.dashboard.product.root);
    } catch (error) {
      console.log("error error ",error);
      showError(error.error)
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
          {!mdUp && <CardHeader title={t('details')} />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label={t('product_name')} />
            <RHFTextField name="description" label={t('description')} />


            <Stack spacing={1.5}>
              <Typography variant="subtitle2">{t('content')}</Typography>
              <RHFEditor simple name="content" />
            </Stack>

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

  const renderProperties = (
    <>
      <Grid xs={12} md={10}>
        <Card>
          {!mdUp && <CardHeader title={t('properties')} />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField
                name="quantity"
                label={t('quantity')}
                placeholder="0"
                type="number"
                InputLabelProps={{ shrink: true }}
              />

              <RHFSelect name="category_id" label={t('category')} >
                <Divider sx={{ borderStyle: 'dashed' }} />
                {categories?.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category?.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFMultiSelect
                checkbox
                name="colors"
                label={t('colors')}
                options={PRODUCT_COLOR_NAME_OPTIONS.map(color => ({
                  ...color,
                  label: t(`color_${color.value}`)
                }))}
              />

              <RHFMultiSelect checkbox name="variations" label={t('sizes')} options={PRODUCT_SIZE_OPTIONS} />
            </Box>

            <RHFAutocomplete
              name="tags"
              label={t('tags')}
              placeholder={`+ ${t('tags')}`}
              multiple
              freeSolo
              options={_tags.map((option) => t(`tag_${option.toLowerCase()}`))}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderPricing = (
    <>
      <Grid xs={12} md={10}>
        <Card>
          {!mdUp && <CardHeader title={t('pricing')} />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="real_price"
              label={t('real_price')}
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            <RHFTextField
              name="sale_price"
              label={t('sale_price')}
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={10} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentProduct ? t('create_product') : t('save_changes')}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderProperties}

        {renderPricing}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}

ProductNewEditForm.propTypes = {
  currentProduct: PropTypes.object,
};
