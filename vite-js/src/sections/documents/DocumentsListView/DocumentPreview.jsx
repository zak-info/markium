import { Button, Container, Stack } from '@mui/material';
import { Box } from '@mui/system';
import { t } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import React from 'react'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import Image from 'src/components/image';
import { useSettingsContext } from 'src/components/settings';
import { STORAGE_API } from 'src/config-global';
import { paths } from 'src/routes/paths';
import showError from 'src/utils/show_error';

const DocumentPreview = () => {
    const settings = useSettingsContext();
    const queryString = new URLSearchParams(window.location.search);
    const fileUrl = queryString.get('url');

    const downloadImage = async (url) => {
        try {
            const response = await fetch(url, { mode: 'cors' });
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = url.split('/').pop(); // optional custom filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(blobUrl); // cleanup
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    const  copyToClipboard = (url)=> {
        navigator.clipboard.writeText(url)
            .then(() => {
                enqueueSnackbar(t("operation_success"));
            })
            .catch(err => {
                showError(err)
            });
    }



    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading={t('documents')}
                links={[
                    {
                        name: t('dashboard'),
                        href: paths.dashboard.root,
                    },
                    {
                        name: t('documents'),
                        href: paths.dashboard.documents.root,
                    },
                    { name: t('overview') },
                ]}
            />
            <Stack width={"full"} display={"flex"} rowGap={2} columnGap={2} alignItems="flex-end" my={4}  >
                <Box rowGap={2} columnGap={2}>
                    <Button onClick={() => { downloadImage(STORAGE_API + "/attachments/mw9ENR3YHI3GkbjWVdt4S7XwmT5sxJ608adHKpmF.pdf") }} variant="outlined" endIcon={<Iconify icon="solar:gallery-download-bold" width={24} />} sx={{ mx: "10px" }} >
                        {t("download")}
                    </Button>
                    {/* </Box> */}
                    {/* <Box> */}
                    <Button onClick={() => { copyToClipboard("http://localhost:3030"+paths.dashboard.documents.preview + `?url=/${fileUrl}`) }} variant="outlined" endIcon={<Iconify icon="solar:copy-bold-duotone" width={24} />}>
                        {t("copy_link")}
                    </Button>
                </Box>
            </Stack>

            {/* src={STORAGE_API + "/attachments/mw9ENR3YHI3GkbjWVdt4S7XwmT5sxJ608adHKpmF.pdf"} */}
            <Image
                alt="file preview"
                src={STORAGE_API + fileUrl}
                sx={{
                    width: 1,
                    height: 1,
                    borderRadius: 1,
                }}
            />



        </Container>
    )
}

export default DocumentPreview