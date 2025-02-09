import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image from '../image';

// ----------------------------------------------------------------------

export default function SingleFilePreview2({ imgUrl = '', fileType = '' ,file}) {
  const isImage = fileType.startsWith('image/');
  const isPdf = fileType === 'application/pdf';

  return (
    <Box
      sx={{
        p: 1,
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid',
        borderRadius: 1,
      }}
    >
      {isImage && (
        <Image
          alt="file preview"
          src={imgUrl}
          sx={{
            width: 1,
            height: 1,
            borderRadius: 1,
          }}
        />
      )}

      {isPdf && (
        <embed
          src={file}
          type="application/pdf"
          width="100%"
          height="100%"
          style={{
            borderRadius: '8px',
          }}
        />
      )}

      {!isImage && !isPdf && (
        <Typography variant="body2" color="textSecondary">
          {fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ? 'Word Document Preview Not Available'
            : 'Unsupported File Type'}
        </Typography>
      )}
    </Box>
  );
}

SingleFilePreview2.propTypes = {
  imgUrl: PropTypes.string,
  fileType: PropTypes.string,
};
