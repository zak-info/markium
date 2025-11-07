import { Helmet } from 'react-helmet-async';
import CarModelsCreateView from 'src/sections/settings/SystemCarModels/CarModelsCreateView';
import CountriesCreateView from 'src/sections/settings/SystemCountries/CountriesCreateView';

// ----------------------------------------------------------------------

export default function CarModelsCreatePage() {
  return (
    <>
      <Helmet>
        <title> System: Car Models Page</title>
      </Helmet>
      <CarModelsCreateView />
    </>
  );
}
