import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import Image from '../image';

// ----------------------------------------------------------------------

export default function SingleFilePreviewLazy({ imgUrl = '', alt = 'preview', sx, ...other }) {
  return (
    <Box
      sx={{
        width: 1,
        height: 1,
        position: 'relative',
        overflow: 'hidden',
        ...sx,
      }}
      {...other}
    >
      <Image
        alt={alt}
        src={imgUrl}
        effect="blur"
        sx={{
          width: 1,
          height: 1,
          objectFit: 'cover',
          borderRadius: 1,
        }}
      />
    </Box>
  );
}

SingleFilePreviewLazy.propTypes = {
  imgUrl: PropTypes.string,
  alt: PropTypes.string,
  sx: PropTypes.object,
};
