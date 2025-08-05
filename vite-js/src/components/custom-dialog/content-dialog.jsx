import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useTranslate } from 'src/locales';
import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function ContentDialog({ title , description ,maxWidth="xs", content, action, open, onClose, ...other }) {
  const { t } = useTranslate();

  return (
    <Dialog fullWidth maxWidth={maxWidth} open={open} onClose={onClose} {...other} sx={{ overflow: 'hidden'}} >
      <DialogTitle sx={{ pb: description ? 0 :2 }}>{title}</DialogTitle>
      { description ?  <DialogTitle sx={{ pb:2 }}><Typography sx={{fontSize:"0.8rem" }}>{description}</Typography> </DialogTitle>: null }

      {content && 
      <DialogContent sx={{ typography: 'body2', pb: 2 }}>

        {content}

      </DialogContent>}

      {/* <DialogActions>
        {action}

        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('cancel')}
        </Button>
      </DialogActions> */}
    </Dialog>
  );
}

ContentDialog.propTypes = {
  action: PropTypes.node,
  content: PropTypes.node,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
};
