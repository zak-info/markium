import { Button, Container, Link, Stack } from '@mui/material';
import { Box } from '@mui/system';
import { t } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import React from 'react'

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import Image from 'src/components/image';
import { useSettingsContext } from 'src/components/settings';
import { HOST_API, STORAGE_API } from 'src/config-global';
import { paths } from 'src/routes/paths';
import showError from 'src/utils/show_error';

const DocumentPreview = () => {
  const settings = useSettingsContext();
  const queryString = new URLSearchParams(window.location.search);
  const fileUrl = queryString.get('url');

  console.log(" sdsdf : ", HOST_API + `/${fileUrl?.split("/")[1]}/${fileUrl?.split("/")[2]}`);
  const handleDownload = (path) => {
    const link = document.createElement("a");
    const lien = HOST_API + path;
    console.log(" HOST_API+imageUrl L", lien);
    link.href = lien;
    link.setAttribute("download", "downloaded-image");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  function downloadImage(imageUrl, filename = 'downloaded-image') {
    const link = document.createElement('a');
    link.href = HOST_API + imageUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  const copyToClipboard = (url) => {
    const baseUrl = window.location.origin;
    const fullUrl = baseUrl + url;
    console.log("fullUrl : ", fullUrl);
    navigator.clipboard.writeText(fullUrl)
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
          {/* <a
            href={HOST_API+`/download/${fileUrl?.split("/")[2]}`}
            target='_blank'
            style={{ textDecoration: "none",color:"white" }}
          > */}
          <Link color={"primary"} href={HOST_API + `/download/${fileUrl?.split("/")[2]}`} target='_blank' >
            <Button
              variant="outlined"
              endIcon={<Iconify icon="solar:gallery-download-bold" width={24} />}
              sx={{ mx: "10px" }}
            >
              {t("download")}
            </Button>
          </Link>
          {/* </a> */}

          <Button
            color={"warning"}
            onClick={() => { copyToClipboard(paths.dashboard.documents.preview + `?url=${fileUrl}`) }}
            variant="outlined"
            endIcon={<Iconify icon="solar:copy-bold-duotone" width={24} />}>
            {t("copy_link")}
          </Button>
        </Box>
      </Stack>

      {/* <Image
                alt="file preview"
                src={STORAGE_API + fileUrl}
                sx={{
                    width: 1,
                    height: 1,
                    borderRadius: 1,
                }}
            /> */}
      {renderFilePreview(fileUrl)}



    </Container>
  )
}

export default DocumentPreview




const getFileExtension = (filename) => {
  return filename.split('.').pop()?.toLowerCase();
};

const renderFilePreview = (fileUrl) => {
  const extension = getFileExtension(fileUrl);
  const filePath = STORAGE_API + fileUrl;

  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
      return (
        <Image
          alt="file preview"
          src={filePath}
          sx={{
            width: 1,
            height: 1,
            borderRadius: 1,
          }}
        />
      );
    case 'pdf':
      return (
        <iframe
          src={filePath}
          style={{ width: '100%', height: '600px', borderRadius: '8px' }}
          title="PDF Preview"
        />
      );
    case 'doc':
    case 'docx':
      return (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(filePath)}`}
          style={{ width: '100%', height: '600px', border: 'none', borderRadius: '8px' }}
          title="Word Document Preview"
        />
      );
    default:
      return <p>Preview not available for this file type.</p>;
  }
};
