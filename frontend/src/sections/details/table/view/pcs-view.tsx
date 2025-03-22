import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

// import { _data_pcs } from 'src/_mock_pcs';

import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { PcsTableRow } from '../pcs-table-row';
import { UserTableHead } from '../table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../table-toolbar';
import { emptyRows, applyFilterPcs, getComparator } from '../utils';

import type { ModePcsProps } from '../pcs-table-row';

// ----------------------------------------------------------------------
interface ModePcsViewProps {
  dataPcs: ModePcsProps[];
}

export function ModePcsView({ dataPcs }: ModePcsViewProps) {
  const table = ModePcsUseTable();

  const [filterName, setFilterName] = useState('');

  const dataFiltered: ModePcsProps[] = applyFilterPcs({
    inputData: dataPcs,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    order: 'desc',
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <>
      {dataPcs.length <= 0 ? (null) : (
        <Card>
          <CardHeader title="ข้อมูลการชั่งน้ำหนัก" subheader="(ชั่งแบบ PCS)" />
          <UserTableToolbar
            numSelected={table.selected.length}
            filterName={filterName}
            onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
              setFilterName(event.target.value);
              table.onResetPage();
            }}
          />

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ widthidth: 800, minWidth: 1000 }}>
                <UserTableHead
                  order={table.order}
                  orderBy={table.orderBy}
                  rowCount={dataPcs.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataPcs.map((data) => data.mode_pcs_id)
                    )
                  }
                  headLabel={[
                    { id: 'timestamp', label: 'Timestamp' },
                    { id: 'serial_number', label: 'Serial number' },
                    { id: 'operator1', label: 'Oper 1' },
                    { id: 'operator2', label: 'Oper 2' },
                    { id: 'primary_pcs', label: 'Set PCS.' },
                    { id: 'pcs', label: 'PCS' },
                    { id: 'isVerified', label: 'Pass/Fail', align: 'center' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <PcsTableRow
                        key={row.mode_pcs_id}
                        row={row}
                        selected={table.selected.includes(row.mode_pcs_id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={68}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataPcs.length)}
                  />

                  {notFound && <TableNoData searchQuery={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            component="div"
            page={table.page}
            count={dataPcs.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      )}
    </>
  )
}

// ----------------------------------------------------------------------

export function ModePcsUseTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'desc';
      setOrder(isAsc ? 'asc' : 'desc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      console.log(event.target.value)
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
