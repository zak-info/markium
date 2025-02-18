import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export default function ContentDialog({ title, content, action, open, onClose, ...other }) {
  const { t } = useTranslate();

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      {content && 
      <DialogContent sx={{ typography: 'body2', pb: 1 }}>

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
