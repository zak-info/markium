import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { UploadIllustration } from 'src/assets/illustrations';

import Iconify from '../iconify';
import MultiFilePreview from './preview-multi-file';
import RejectionFiles from './errors-rejection-files';
import SingleFilePreview from './preview-single-file';
import SingleFilePreview2 from './preview-single-file2';
import { useRef, useState } from 'react';
import { t } from 'i18next';

// ----------------------------------------------------------------------

export default function Upload({
  disabled,
  multiple = false,
  error,
  name,
  helperText,
  //
  lable,
  field,
  file,
  onDelete,
  //
  files,
  thumbnail,
  onUpload,
  onRemove,
  onRemoveAll,
  sx,
  ...other
}) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple,
    disabled,
    ...other,
  });

  const hasFile = !!file && !multiple;
  console.log("fily is  : ", file?.name);


  const inputRef = useRef(null);
  const handleReset = () => {
    const fileInput = document.getElementById("input_fl_name");
    if (fileInput) {
      fileInput.click();
    }
  };
  const handleClick = () => {
    const fileInput = document.getElementById("input_fl_name");
    if (fileInput) {
      fileInput.reset();
    }
  };

  const [imagePreview, setImagePreview] = useState(null);


  const hasFiles = !!files && multiple && !!files.length;
  console.log("filys are  : ", files);

  const hasError = isDragReject || !!error;

  const renderPlaceholder = (
    <Stack spacing={3} alignItems="center" justifyContent="center" flexWrap="wrap">
      {/* <UploadIllustration sx={{ width: 1, maxWidth: 200 }} /> */}
      <Stack spacing={1} sx={{ textAlign: 'center' }}>
        <Typography variant="h6">{lable || "Drop or Select file"}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {/* Drop files here or click */}
          <Box
            component="span"
            sx={{
              mx: 0.5,
              color: 'primary.main',
              textDecoration: 'underline',
            }}
          >
            {t("browse")}
          </Box>
          {/* thorough your machine */}
        </Typography>
      </Stack>
    </Stack>
  );

  const renderSinglePreview = (
    <SingleFilePreview imgUrl={imagePreview} filename={file?.name} />
  );

  const removeSinglePreview = hasFile && onDelete && (
    <IconButton
      size="small"
      onClick={onDelete}
      sx={{
        top: 16,
        right: 16,
        zIndex: 9,
        position: 'absolute',
        color: (theme) => alpha(theme.palette.common.white, 0.8),
        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
        '&:hover': {
          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
        },
      }}
    >
      <Iconify icon="mingcute:close-line" width={18} />
    </IconButton>
  );

  const renderMultiPreview = hasFiles && (
    <>
      <Box sx={{ my: 3 }}>
        <MultiFilePreview files={files} thumbnail={thumbnail} onRemove={onRemove} />
      </Box>

      <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
        {onRemoveAll && (
          <Button color="inherit" variant="outlined" size="small" onClick={onRemoveAll}>
            Remove All
          </Button>
        )}

        {onUpload && (
          <Button
            size="small"
            variant="contained"
            onClick={onUpload}
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          >
            Upload
          </Button>
        )}
      </Stack>
    </>
  );

  return (
    <Box sx={{ width: 1, position: 'relative', ...sx }}>
      <Box
        {...getRootProps()}
        sx={{
          p: 5,
          outline: 'none',
          borderRadius: 1,
          cursor: 'pointer',
          overflow: 'hidden',
          position: 'relative',
          height: imagePreview ? "250px" : "auto",
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
          border: (theme) => `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,
          transition: (theme) => theme.transitions.create(['opacity', 'padding']),
          '&:hover': {
            opacity: 0.72,
          },
          ...(isDragActive && {
            opacity: 0.72,
          }),
          ...(disabled && {
            opacity: 0.48,
            pointerEvents: 'none',
          }),
          ...(hasError && {
            color: 'error.main',
            borderColor: 'error.main',
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
          }),
          ...(hasFile && {
            padding: '24% 0',
          }),
        }}
      >
        <input {...getInputProps()} id='input_fl_name' name={name}
          onChange={(e) => {
            field.onChange(e.target.files[0]);
            const fileUrl = URL.createObjectURL(e.target.files[0]);
            setImagePreview(fileUrl);
          }}
          onReset={(e) => {
            field?.removeSinglePreview
          }}
        />

        {hasFile ? renderSinglePreview : renderPlaceholder}
      </Box>

      {/* {removeSinglePreview} */}
      {/* <Stack sx={{mt:1,display:"flex",flexDirection:'row',gap:"4px"}} >
        <Iconify onClick={() => handleClick} icon="solar:trash-bin-trash-bold" />
        <Iconify onClick={() => handleReset} icon="solar:trash-bin-trash-bold" />
      </Stack> */}

      {helperText && helperText}

      <RejectionFiles fileRejections={fileRejections} />

      {renderMultiPreview}
    </Box>
  );
}

Upload.propTypes = {
  disabled: PropTypes.object,
  error: PropTypes.bool,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  name: PropTypes.string,
  files: PropTypes.array,
  helperText: PropTypes.object,
  multiple: PropTypes.bool,
  onDelete: PropTypes.func,
  onRemove: PropTypes.func,
  onRemoveAll: PropTypes.func,
  onUpload: PropTypes.func,
  sx: PropTypes.object,
  thumbnail: PropTypes.bool,
};
