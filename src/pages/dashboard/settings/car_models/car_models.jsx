import { Helmet } from 'react-helmet-async';
import CarModelsListView from 'src/sections/settings/SystemCarModels/CarModelsListView';
// ----------------------------------------------------------------------

export default function CarModelsListPage() {
  return (
    <>
      <Helmet>
        <title> Settings: CarModels Page</title>
      </Helmet>

      <CarModelsListView />
    </>
  );
}
