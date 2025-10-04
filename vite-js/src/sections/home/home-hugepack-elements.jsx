import { m } from 'framer-motion';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Radio from '@mui/material/Radio';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Alert from '@mui/material/Alert';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle';
import AvatarGroup from '@mui/material/AvatarGroup';
import ToggleButton from '@mui/material/ToggleButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { paths } from 'src/routes/paths';

import { useResponsive } from 'src/hooks/use-responsive';

import { _mock } from 'src/_mock';

import Label from 'src/components/label';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';
import { t } from 'i18next';

// ----------------------------------------------------------------------

export default function HomeHugePackElements() {
  const mdUp = useResponsive('up', 'md');

  const [slider, setSlider] = useState(24);

  const [select, setSelect] = useState('Option 1');

  const [app, setApp] = useState('chat');

  const [rating, setRating] = useState(2);

  const [currentTab, setCurrentTab] = useState('Client');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleChangeSelect = useCallback((event) => {
    setSelect(event.target.value);
  }, []);

  const viewAllBtn = (
    <m.div variants={varFade().inUp}>
      <Button
        size="large"
        color="inherit"
        variant="outlined"
        target="_blank"
        rel="noopener"
        href={paths.components}
        endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
      >
       {t("discover_more")}
      </Button>
    </m.div>
  );

  const renderDescription = (
    <Stack
      sx={{
        textAlign: { xs: 'center', md: 'unset' },
        pl: { md: 5 },
        pt: { md: 15 },
      }}
    >
      <m.div variants={varFade().inUp}>
        <Typography component="div" variant="overline" sx={{ color: 'text.disabled' }}>
          {t("store_starter_kit")}
        </Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <Typography variant="h2" sx={{ my: 3 }}>
          {t("powerful_features")}
        </Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <Typography
          sx={{
            mb: 5,
            color: 'text.secondary',
          }}
        >
          {t("store_solution")}
        </Typography>
      </m.div>

      {mdUp && viewAllBtn}
    </Stack>
  );

  const renderContent = (
    <Stack
      component={Paper}
      variant="outlined"
      alignItems="center"
      spacing={{ xs: 3, md: 5 }}
      sx={{
        borderRadius: 2,
        bgcolor: 'unset',
        borderStyle: 'dashed',
        p: { xs: 3, md: 5 },
      }}
    >
      {/* Row 1 */}
      <Stack
        direction="row"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="center"
        spacing={{ xs: 3, md: 4 }}
        sx={{ width: 1 }}
      >
        <m.div variants={varFade().in}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="solar:cart-plus-bold" />}
          >
           {t("add_to_cart")}
          </Button>
        </m.div>

        <m.div variants={varFade().in}>
          <Button
            variant="soft"
            color="primary"
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          >
            {t("upload_product")}
          </Button>
        </m.div>

        <m.div variants={varFade().in}>
          <Fab color="info" size="medium">
            <Iconify icon="eva:search-fill" />
          </Fab>
        </m.div>

        <m.div variants={varFade().in}>
          <CircularProgress color="error" />
        </m.div>
      </Stack>

      {/* Row 2 */}
      <Stack
        direction="row"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="center"
        spacing={{ xs: 3, md: 4 }}
        sx={{ width: 1 }}
      >
        <m.div variants={varFade().in}>
          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            sx={{
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {['Orders', 'Products', 'Customers'].map((tab) => (
              <Tab
                key={tab}
                value={tab}
                label={t(tab.toLowerCase())}
                sx={{
                  '&:not(:last-of-type)': { mr: 3 },
                }}
              />
            ))}
          </Tabs>
        </m.div>

        <m.div variants={varFade().in}>
          <ToggleButtonGroup
            size="small"
            color="secondary"
            value={app}
            exclusive
            onChange={(event, newValue) => {
              if (newValue !== null) {
                setApp(newValue);
              }
            }}
            aria-label="app"
          >
            {['chat', 'mail', 'bell'].map((item) => (
              <ToggleButton key={item} value={item} aria-label={item} disabled={item === 'bell'}>
                {item === 'chat' && <Iconify icon="solar:chat-round-dots-bold" />}
                {item === 'mail' && <Iconify icon="fluent:mail-24-filled" />}
                {item === 'bell' && <Iconify icon="solar:bell-bing-bold" />}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </m.div>

        <m.div variants={varFade().in}>
          <Chip
            color="error"
            variant="soft"
            onDelete={() => {}}
            avatar={<Avatar alt={_mock.fullName(2)} src={_mock.image.avatar(3)} />}
            label={t("notification")}
          />
        </m.div>
      </Stack>

      {/* Row 3 */}
      <Stack
        direction="row"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="center"
        spacing={{ xs: 3, md: 4 }}
        sx={{ width: 1 }}
      >
        <m.div variants={varFade().in}>
          <Badge variant="online" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Avatar src={_mock.image.avatar(19)} alt={_mock.fullName(19)} />
          </Badge>
        </m.div>

        <m.div variants={varFade().in}>
          <AvatarGroup>
            {[...Array(8)].map((_, index) => (
              <Avatar key={index} src={_mock.image.avatar(index)} />
            ))}
          </AvatarGroup>
        </m.div>

        <m.div variants={varFade().in}>
          <Rating
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
        </m.div>

        <m.div variants={varFade().in}>
          <Label variant="filled" startIcon={<Iconify icon="fluent:mail-24-filled" />}>
            {t("verified")}
          </Label>
        </m.div>
      </Stack>

      {/* Row 4 */}
      <Stack
        spacing={{ xs: 3, md: 4 }}
        sx={{
          width: 1,
          gap: 3,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
        }}
      >
        <m.div variants={varFade().in}>
          <Slider
            valueLabelDisplay="on"
            value={slider}
            onChange={(event, newValue) => {
              setSlider(newValue);
            }}
          />
        </m.div>

        <m.div variants={varFade().in}>
          <Alert severity="success" onClose={() => {}}>
            <AlertTitle>{t("success")}</AlertTitle>
            {t("order_placed_successfully")} — <strong>{t("verified")}</strong>
          </Alert>
        </m.div>
      </Stack>

      {mdUp && (
        <>
          {/* Row 5 */}
          <Stack
            direction="row"
            flexWrap="wrap"
            alignItems="center"
            justifyContent="center"
            spacing={{ xs: 3, md: 4 }}
            sx={{ width: 1 }}
          >
            <m.div variants={varFade().in}>
              <FormControlLabel control={<Switch defaultChecked />} label={t("in_stock")} sx={{ m: 0 }} />
            </m.div>

            <m.div variants={varFade().in}>
              <FormControlLabel
                control={<Radio color="error" defaultChecked />}
                label={t("urgent")}
                sx={{ m: 0 }}
              />
            </m.div>

            <m.div variants={varFade().in}>
              <FormControlLabel
                control={<Checkbox color="info" defaultChecked />}
                label={t("published")}
                sx={{ m: 0 }}
              />
            </m.div>

            <m.div variants={varFade().in}>
              <FormControlLabel
                control={<Checkbox color="warning" indeterminate />}
                label={t("warning")}
                sx={{ m: 0 }}
              />
            </m.div>
          </Stack>

          {/* Row 6 */}
          <Stack spacing={3} direction="row" justifyContent="center" sx={{ width: 1 }}>
            <m.div variants={varFade().in}>
              <Paper
                sx={{
                  width: 320,
                  borderRadius: 2,
                  boxShadow: (theme) => theme.customShadows.z20,
                }}
              >
                <CardHeader
                  title={t("premium_electronics_store")}
                  subheader={t("riyadh_saudi_arabia")}
                  avatar={
                    <Badge
                      variant="online"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                      <Avatar
                        alt={_mock.fullName(0)}
                        src={_mock.image.avatar(0)}
                        sx={{
                          width: 48,
                          height: 48,
                        }}
                      />
                    </Badge>
                  }
                  titleTypographyProps={{
                    typography: 'subtitle2',
                    sx: { mb: 0.25 },
                  }}
                  subheaderTypographyProps={{ typography: 'caption' }}
                  sx={{ p: 2 }}
                />
                <Box sx={{ px: 1 }}>
                  <Image
                    alt="cover-url"
                    src={_mock.image.cover(12)}
                    ratio="16/9"
                    sx={{
                      borderRadius: 1.5,
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ color: 'text.secondary', pt: 2, px: 2 }}>
                  {/* Phasellus dolor. Fusce egestas elit eget lorem. Quisque id odio. */}
                </Typography>

                <Stack direction="row" sx={{ px: 2, py: 1 }}>
                  <Checkbox
                    defaultChecked
                    color="error"
                    size="small"
                    icon={<Iconify icon="solar:heart-bold" />}
                    checkedIcon={<Iconify icon="solar:heart-bold" />}
                  />

                  <Box sx={{ flexGrow: 1 }} />

                  <IconButton>
                    <Iconify icon="solar:share-bold" />
                  </IconButton>

                  <IconButton>
                    <Iconify icon="eva:message-circle-fill" />
                  </IconButton>
                </Stack>
              </Paper>
            </m.div>

            <Stack spacing={3} sx={{ width: 1 }}>
              <m.div variants={varFade().in}>
                <TextField fullWidth label={t("name")} value="...." />
              </m.div>

              <m.div variants={varFade().in}>
                <TextField
                  select
                  fullWidth
                  label={t("type")}
                  value={select}
                  onChange={handleChangeSelect}
                >
                  {[t("electronics"), t("clothing"), t("home_goods"), t("books")].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </m.div>

              <m.div variants={varFade().in}>
                <TextField fullWidth multiline rows={3} label={t("description")} />
              </m.div>
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 15 },
      }}
    >
      <Grid container direction={{ xs: 'column', md: 'row-reverse' }} spacing={5}>
        <Grid xs={12} md={5}>
          {renderDescription}
        </Grid>

        <Grid xs={12} md={7}>
          {renderContent}
        </Grid>

        {!mdUp && (
          <Grid xs={12} sx={{ textAlign: 'center' }}>
            {viewAllBtn}
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
