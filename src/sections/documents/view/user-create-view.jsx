import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import UserNewEditForm from '../user-new-edit-form';
import { useTranslate } from 'src/locales';
import { useGetDocument, useGetDocuments } from 'src/api/document';
// import UserNewEditForm2 from '../user-new-edit-form2';

// ----------------------------------------------------------------------

export default function UserCreateView({id}) {
  const settings = useSettingsContext();
  const { t } = useTranslate();

  const { document : currentDocument } = useGetDocument(id);
  console.log(" currentDocument currentDocument currentDocument ",currentDocument)
  
    // const currentDocument = documents?.find((i) => i.id == id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={currentDocument ? t("editDocument"):t('addNewDocument')}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('documentsList'),
            href: paths.dashboard.documents.root,
          },
          { name: currentDocument ? t("editDocument"):t('addNewDocument') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserNewEditForm currentDocument={currentDocument} />
    </Container>
  );
}
