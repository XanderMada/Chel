import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { findValueInItemByValuePath } from '../Utils/ObjectSearch';
import styled from 'styled-components';

const TopTableHead = styled(TableHead)`
  position: sticky;
  top: 0;
  background-color: #ffffff;
`;

export type DataColumnDescriptor = {
  name: string;
  valuePath?: string;
  transform?: (value: any) => ReactNode;
};

type DataTableCellProps = Omit<DataColumnDescriptor, 'name'> & {
  item: Record<string, any>;
};

const DataTableCell: FC<DataTableCellProps> = ({ item, valuePath, transform }) => {
  const value = useMemo(() => {
    const foundValue = typeof valuePath === 'string' ? findValueInItemByValuePath(item, valuePath) : item;

    return transform ? transform(foundValue) : foundValue;
  }, [item, valuePath, transform]);

  return <TableCell>{`${value}`}</TableCell>;
};

export type DataTableContext = {
  addDataColumn: (dataColumn: DataColumnDescriptor) => void;
  removeDataColumn: (dataColumn: DataColumnDescriptor) => void;
};

export const DataTableContext = createContext<DataTableContext>({
  addDataColumn: () => undefined,
  removeDataColumn: () => undefined,
});
const { Provider: DataTableProvider } = DataTableContext;

export type DataTableColumnProps = DataColumnDescriptor;

export const DataTableColumn: FC<DataTableColumnProps> = ({ name, valuePath, transform }) => {
  const { addDataColumn, removeDataColumn } = useContext<DataTableContext>(DataTableContext);

  useEffect(() => {
    const dataColumn = { name, valuePath, transform };

    addDataColumn(dataColumn);

    return () => removeDataColumn(dataColumn);
  }, [name, valuePath, transform]);

  return <></>;
};

export type DataTableProps = {
  children?: ReactNode;
  data: any[];
};

export const DataTable: FC<DataTableProps> = ({
                                                children,
                                                data = [],
                                              }) => {
  const dataColumnsRef = useRef<Record<string, DataColumnDescriptor>>({});
  const [dataColumnsUpdateMarker, setDataColumnsUpdateMarker] = useState<Record<string, DataColumnDescriptor>>({});
  const dataColumnsArray = useMemo<DataColumnDescriptor[]>(() => Object.values(dataColumnsRef.current), [dataColumnsUpdateMarker]);
  const addDataColumn = useCallback(
    (dataColumn: DataColumnDescriptor) => {
      const { name } = dataColumn;

      dataColumnsRef.current = {
        ...dataColumnsRef.current,
        [name]: dataColumn,
      };

      setDataColumnsUpdateMarker({});
    },
    [],
  );
  const removeDataColumn = useCallback(
    (dataColumn: DataColumnDescriptor) => {
      const { name } = dataColumn;
      const {
        [name]: _dataColumnToRemove,
        ...restDataColumns
      } = dataColumnsUpdateMarker;

      dataColumnsRef.current = restDataColumns;

      setDataColumnsUpdateMarker({});
    },
    [],
  );
  const dataTableContext = useMemo(
    () => ({
      addDataColumn,
      removeDataColumn,
    }),
    [addDataColumn, removeDataColumn],
  );

  return (
    <DataTableProvider value={dataTableContext}>
      {children}
      <Table sx={{ minWidth: 650 }}>
        <TopTableHead>
          <TableRow>
            {dataColumnsArray.map(({ name }, i) => (
              <TableCell key={`${name}:${i}`}>{name}</TableCell>
            ))}
          </TableRow>
        </TopTableHead>
        <TableBody>
          {data.map((item, i) => {
            const { id } = item || {};

            return (
              <TableRow key={`${id}:${i}`}>
                {dataColumnsArray.map(({ valuePath, transform }, j) => (
                  <DataTableCell key={`${valuePath}:${j}`} item={item} valuePath={valuePath} transform={transform} />
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </DataTableProvider>
  );
};
