import React, { useState, useEffect } from 'react';
import LayoutHideSidebar from 'components/LayoutHideSidebar';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { useMongo } from 'hooks/useMongo';
import config from '../../../config';

import { useTable } from 'react-table';

const Container = styled.div`
  width: 100vw;
  margin: 0 auto;
  padding: 0 2rem;
  overflow: auto;
  font-size: 0.8em;

  @media (max-width: 767px) {
    padding: 0;
  }
`;

const TableStyles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

const ScrollCell = styled.div`
  /* width: 100%; */
  /* height: 20px; */
  margin: 0;
  padding: 0;
  overflow: auto;
`;

export default function ClassificationsDbView(props) {
  const [loading, setLoading] = useState(false);

  const [tableData, setTableData] = useState([]);

  const [columnData, setColumnData] = useState([]);

  // data fetch method - paginated
  const fetchClassificationData = () => {
    return new Promise((resolve, reject) => {
      const { runQuery } = useMongo();

      try {
        runQuery(
          {},
          (res) => {
            resolve(res);
          },
          config.realm.production_db.db_service,
          config.realm.production_db.db_name,
          'classifications'
        );
      } catch (error) {
        reject(error);
      }
    });
  };

  const fetchTaxaData = () => {
    return new Promise((resolve, reject) => {
      const { runQuery } = useMongo();

      try {
        runQuery(
          {
            namespace: 'CSET',
          },
          (res) => {
            resolve(res);
          },
          config.realm.production_db.db_service,
          config.realm.production_db.db_name,
          'taxa'
        );
      } catch (error) {
        reject(error);
      }
    });
  };

  useEffect(() => {
    const fieldToColumnMap = (taxaField) => {
      return {
        Header: taxaField.short_name,
        accessor: taxaField.short_name.split(' ').join(''),
      };
    };

    const classificationsToRowsMap = (cObj) => {
      const row = {};

      for (const key in cObj.classifications) {
        row[key.split(' ').join('')] = cObj.classifications[key];
      }

      return row;
    };

    setLoading(true);
    const initSetup = async () => {
      const classificationData = await fetchClassificationData();

      setTableData(classificationData.map(classificationsToRowsMap));

      const taxaData = await fetchTaxaData();

      setColumnData(taxaData[0].field_list.map(fieldToColumnMap));

      console.log(columnData);
      setLoading(false);
    };

    initSetup();
  }, []);

  // loading state
  // table setup
  /**
   * Characteristisc:
   *
   * virtualized rows
   * sorting
   * filtering
   * paginated - with fetch + loading
   * column resizing
   * full width
   * bootstrap
   */

  const data = React.useMemo(() => tableData, [tableData]);

  const columns = React.useMemo(() => [...columnData], [columnData]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  if (loading) {
    return (
      <LayoutHideSidebar {...props}>
        <Helmet>
          <title>Artifical Intelligence Incident Database</title>
        </Helmet>
        <Container>
          <div>loading...</div>
        </Container>
      </LayoutHideSidebar>
    );
  }

  if (!columnData || !tableData) {
    return (
      <LayoutHideSidebar {...props}>
        <Helmet>
          <title>Artifical Intelligence Incident Database</title>
        </Helmet>
        <Container>
          <div>Error</div>
        </Container>
      </LayoutHideSidebar>
    );
  }

  const TableComponent = () => {
    return (
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th key={column.id} {...column.getHeaderProps()}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr key={row.id} {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td key={cell.id} {...cell.getCellProps()}>
                      <ScrollCell>{cell.render('Cell')}</ScrollCell>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <LayoutHideSidebar {...props}>
      <Helmet>
        <title>Artifical Intelligence Incident Database</title>
      </Helmet>
      <Container>
        <TableStyles>
          <TableComponent />
        </TableStyles>
      </Container>
    </LayoutHideSidebar>
  );
}
