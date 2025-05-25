import React, { useCallback, useState } from 'react'
import OrderTableToolbar from './zaity-table-toolbar';
import OrderTableFiltersResult from './zaity-table-filters-result';
import { useTable } from 'src/components/table';

const ZaityTableFilters = ({ children, defaultFilters, dateError, dataFiltered }) => {
    const table = useTable({ defaultOrderBy: 'orderNumber' });

    const [filters, setFilters] = useState(defaultFilters);

    const handleFilters = useCallback((name, value) => {
        setFilters((prevState) => ({ ...prevState, [name]: value }));
    }, [table]);

    const handleResetFilters = useCallback(() => {
        setFilters(defaultFilters);
    }, []);

    const canReset = !!Object.values(filters).some(val => val?.name != null && val?.name !== "");
    // const canReset = !!filters.plat_number


    return (
        <>
            <OrderTableToolbar filters={filters} onFilters={handleFilters} dateError={dateError} />
            {canReset && (
                <OrderTableFiltersResult
                    filters={filters}
                    onFilters={handleFilters}
                    onResetFilters={handleResetFilters}
                    results={dataFiltered?.length}
                    sx={{ p: 2.5, pt: 0 }}
                />
            )}
            {children}
        </>
    )
}

export default ZaityTableFilters

function applyFilter({ inputData, comparator, filters, dateError }) {
  // Sort the input data in a stable manner
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  // Apply each filter dynamically
  Object.entries(filters).forEach(([key, value]) => {
    if (!value || value === "All") return;

    inputData = inputData.filter(item => {
      const fieldValue = item?.[key];
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(value);
      }
      return fieldValue == value;
    });
  });

  return inputData;
}
