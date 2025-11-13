import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { alpha } from '@mui/material/styles';

import { useTranslate } from 'src/locales';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function ContactSupportView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();

  const contacts = [
    {
      id: 'whatsapp_arabic',
      title: t('whatsapp_arabic'),
      subtitle: t('arabic_support'),
      phone: '0540270517',
      icon: 'ic:baseline-whatsapp',
      color: '#25D366',
      link: 'https://wa.me/213540270517',
      description: t('arabic_support_description'),
    },
    {
      id: 'whatsapp_french',
      title: t('whatsapp_french'),
      subtitle: t('french_support'),
      phone: '+33 7 58 07 15 53',
      icon: 'ic:baseline-whatsapp',
      color: '#25D366',
      link: 'https://wa.me/33758071553',
      description: t('french_support_description'),
    },
    {
      id: 'telegram',
      title: 'Telegram',
      subtitle: t('instant_messaging'),
      phone: '0540270517',
      icon: 'ic:baseline-telegram',
      color: '#0088cc',
      link: 'https://t.me/+213540270517',
      description: t('telegram_description'),
    },
    {
      id: 'facebook',
      title: 'Facebook',
      subtitle: t('social_media_support'),
      displayText: t('visit_our_page'),
      icon: 'eva:facebook-fill',
      color: '#1877F2',
      link: 'https://web.facebook.com/profile.php?id=61582479703034',
      description: t('facebook_support_description'),
    },
  ];

  const handleContact = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <Helmet>
        <title>{t('contact_support')} | {t('dashboard')}</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('contact_support')}
          links={[
            { name: t('dashboard'), href: paths.dashboard.root },
            { name: t('contact_support') },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        {/* Hero Section */}
        <Card
          sx={{
            p: 5,
            mb: 4,
            textAlign: 'center',
            background: (theme) =>
              `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(
                theme.palette.primary.main,
                0.02
              )} 100%)`,
            border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Box
              sx={{
                position: 'relative',
                display: 'inline-flex',
              }}
            >
              <Avatar
                sx={{
                  width: 96,
                  height: 96,
                  bgcolor: 'primary.main',
                  boxShadow: (theme) => theme.customShadows.primary,
                }}
              >
                <Iconify icon="solar:chat-round-call-bold-duotone" width={56} color="common.white" />
              </Avatar>
              <Box
                sx={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: 'success.main',
                  border: (theme) => `3px solid ${theme.palette.background.paper}`,
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': {
                      boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)',
                    },
                    '70%': {
                      boxShadow: '0 0 0 10px rgba(34, 197, 94, 0)',
                    },
                    '100%': {
                      boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)',
                    },
                  },
                }}
              />
            </Box>
          </Box>
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
            {t('need_help')}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', fontWeight: 400 }}>
            {t('contact_support_description')}
          </Typography>
        </Card>

        {/* Contact Methods */}
        <Grid container spacing={3}>
          {contacts.map((contact) => (
            <Grid xs={12} key={contact.id}>
              <Card>
                <Accordion
                  defaultExpanded
                  sx={{
                    '&:before': {
                      display: 'none',
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    sx={{
                      backgroundColor: 'background.neutral',
                      minHeight: 80,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                      '& .MuiAccordionSummary-content': {
                        my: 2,
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%', pr: 2 }}>
                      <Avatar
                        sx={{
                          width: 64,
                          height: 64,
                          bgcolor: alpha(contact.color, 0.12),
                          boxShadow: (theme) => `0 4px 12px ${alpha(contact.color, 0.2)}`,
                        }}
                      >
                        <Iconify icon={contact.icon} width={36} sx={{ color: contact.color }} />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 600 }}>
                          {contact.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {contact.subtitle}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: { xs: 'none', sm: 'flex' },
                          alignItems: 'center',
                          gap: 1,
                          px: 2,
                          py: 1,
                          borderRadius: 1.5,
                          bgcolor: alpha(contact.color, 0.08),
                          border: (theme) => `1px solid ${alpha(contact.color, 0.2)}`,
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: contact.color,
                            animation: 'pulse 2s infinite',
                          }}
                        />
                        <Typography variant="caption" sx={{ fontWeight: 600, color: contact.color }}>
                          {t('available_now')}
                        </Typography>
                      </Box>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={3} sx={{ p: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                        {contact.description}
                      </Typography>

                      <Divider />

                      {contact.phone && (
                        <Box
                          sx={{
                            textAlign: 'center',
                            py: 3,
                            px: 3,
                            borderRadius: 2,
                            bgcolor: alpha(contact.color, 0.08),
                            border: (theme) => `2px dashed ${alpha(contact.color, 0.3)}`,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                            {t('contact_number')}
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: contact.color }}>
                            {contact.phone}
                          </Typography>
                        </Box>
                      )}

                      {contact.displayText && (
                        <Box
                          sx={{
                            textAlign: 'center',
                            py: 3,
                            px: 3,
                            borderRadius: 2,
                            bgcolor: alpha(contact.color, 0.08),
                            border: (theme) => `2px dashed ${alpha(contact.color, 0.3)}`,
                          }}
                        >
                          <Typography variant="h5" sx={{ fontWeight: 600, color: contact.color }}>
                            {contact.displayText}
                          </Typography>
                        </Box>
                      )}

                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Button
                          variant="contained"
                          size="large"
                          fullWidth
                          onClick={() => handleContact(contact.link)}
                          startIcon={<Iconify icon={contact.icon} width={24} />}
                          sx={{
                            bgcolor: contact.color,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            boxShadow: (theme) => `0 8px 16px ${alpha(contact.color, 0.3)}`,
                            '&:hover': {
                              bgcolor: contact.color,
                              opacity: 0.92,
                              boxShadow: (theme) => `0 12px 24px ${alpha(contact.color, 0.4)}`,
                            },
                          }}
                        >
                          {contact.id === 'facebook' ? t('visit_page') : t('start_chat')}
                        </Button>
                        <Button
                          variant="outlined"
                          size="large"
                          onClick={() => {
                            if (contact.phone) {
                              navigator.clipboard.writeText(contact.phone);
                            } else {
                              navigator.clipboard.writeText(contact.link);
                            }
                          }}
                          startIcon={<Iconify icon="solar:copy-bold" width={20} />}
                          sx={{
                            borderColor: alpha(contact.color, 0.3),
                            color: contact.color,
                            minWidth: { xs: '100%', sm: 140 },
                            '&:hover': {
                              borderColor: contact.color,
                              bgcolor: alpha(contact.color, 0.08),
                            },
                          }}
                        >
                          {t('copy')}
                        </Button>
                      </Stack>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Support Hours Info */}
        <Card
          sx={{
            p: 4,
            mt: 4,
            textAlign: 'center',
            background: (theme) =>
              `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.08)} 0%, ${alpha(
                theme.palette.success.main,
                0.02
              )} 100%)`,
            border: (theme) => `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 2 }}>
            <Iconify icon="solar:clock-circle-bold-duotone" width={48} sx={{ color: 'success.main' }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {t('support_hours')}
            </Typography>
          </Stack>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            {t('support_hours_description')}
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 3,
              py: 1,
              borderRadius: 2,
              bgcolor: 'success.lighter',
              border: (theme) => `1px solid ${theme.palette.success.light}`,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'success.main',
                animation: 'pulse 2s infinite',
              }}
            />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'success.darker' }}>
              {t('available_now')}
            </Typography>
          </Box>
        </Card>
      </Container>
    </>
  );
}
