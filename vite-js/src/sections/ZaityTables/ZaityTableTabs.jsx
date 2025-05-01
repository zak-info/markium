import React, { useCallback, useEffect, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Label from 'src/components/label';
import { getComparator, useTable } from 'src/components/table';

const ZaityTableTabs = ({
  children,
  data = [],
  items = [],
  setTableDate,
  dateError,
  defaultFilters = {},
  defaultOrderBy = 'orderNumber',
  filterFunction,
  t = (text) => text,
}) => {
  const table = useTable({ defaultOrderBy });
  const [filters, setFilters] = useState(defaultFilters);

  const handleFilters = useCallback((name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, [data]);
  

  
  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const dataFiltered = applyFilter({
    inputData: data,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  useEffect(()=>{
    setTableDate(dataFiltered)
  },[filters])

  // useEffect(() => {
  //   const filteredData = applyFilter({
  //     inputData: data,
  //     comparator: getComparator(table.order, table.orderBy),
  //     filters,
  //     filterFunction,
  //   });

  //   setTableDate(filteredData);
  // }, [data, table.order, table.orderBy, filters, setTableDate, filterFunction]);

  return (
    <>
      <Tabs
        value={filters?.status}
        onChange={handleFilterStatus}
        sx={{
          px: 2.5,
          boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
        }}
      >

        {/* <Tab
          key={"all"}
          iconPosition="end"
          value={"All"}
          label={t("all")}
          icon={
            <Label
              variant={'soft'}
              color={'default'}
            >
              {data?.length}
            </Label>
          }
        /> */}
        {items.map((tab, index) => {
          const count = tab.count ?? data.filter((item) => tab.match?.(item, filters)).length;

          return (
            <Tab
              key={index}
              value={tab.key}
              iconPosition="end"
              label={tab.label}
              icon={
                <Label
                  variant={tab.key === filters.tabKey ? 'filled' : 'soft'}
                  color={tab.color || 'default'}
                >
                  {count}
                </Label>
              }
            />
          );
        })}
      </Tabs>

      {children}
    </>
  );
};

export default ZaityTableTabs;

// ———————————————


function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (status) {
    if (status == "All" || status == "all") {
      inputData = inputData;
    } else {
      inputData = inputData.filter(order =>
        order?.status?.includes(status)
      );
    }
  }
  return inputData;
}
