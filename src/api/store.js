import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export async function updateStoreLogo(formData) {
  const URL = endpoints.store.root;

  return await axios.post(URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
