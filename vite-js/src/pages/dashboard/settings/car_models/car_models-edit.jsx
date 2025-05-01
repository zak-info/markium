import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import CarModelsCreateView from 'src/sections/settings/SystemCarModels/CarModelsCreateView';
import CountriesCreateView from 'src/sections/settings/SystemCountries/CountriesCreateView';
// ----------------------------------------------------------------------

export default function CarModelsEditPage() {
   const params = useParams();
  
    const { id } = params;
  
  return (
    <>
      <Helmet>
        <title> System: Edit a Car Models</title>
      </Helmet>

      <CarModelsCreateView id={id} />
    </>
  );
}
