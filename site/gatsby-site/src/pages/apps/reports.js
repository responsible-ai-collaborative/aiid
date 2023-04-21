import React, { useEffect, useState } from 'react';
import AiidHelmet from '../../components/AiidHelmet';
import { format } from 'date-fns';
import Link from '../../components/ui/Link';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { useTable, useFilters, usePagination, useSortBy } from 'react-table';
import { gql, useQuery } from '@apollo/client';
import Layout from 'components/Layout';
import { useMenuContext } from 'contexts/MenuContext';
import ListSkeleton from 'elements/Skeletons/List';
import { useTranslation } from 'react-i18next';
import { Button, Select } from 'flowbite-react';
import Table, { DefaultColumnFilter, DefaultColumnHeader } from 'components/ui/Table';

const SelectColumnFilter = ({ column: { filterValue, setFilter, preFilteredRows, id } }) => {
  let options;

  const ARRAY_COLUMNS = ['submitters'];

  const filterOptionsFromArray = () => {
    return (options = React.useMemo(() => {
      const options = new Set();

      preFilteredRows.forEach((row) => {
        if (Array.isArray(row.values[id])) {
          row.values[id].forEach((w) => {
            if (w !== '') {
              options.add(w);
            }
          });
        } else {
          if (row.values[id] !== '') {
            options.add(row.values[id]);
          }
        }
      });
      return [...options.values()];
    }, [id, preFilteredRows]));
  };

  if (ARRAY_COLUMNS.includes(id)) {
    options = filterOptionsFromArray();
  } else {
    options = React.useMemo(() => {
      const options = new Set();

      preFilteredRows.forEach((row) => {
        if (row.values[id] !== '') {
          options.add(row.values[id]);
        }
      });
      return [...options.values()];
    }, [id, preFilteredRows]);
  }

  const filteredOptions = options.filter((o) => o !== '-');

  return (
    <Select
      style={{ width: '100%' }}
      className="mt-2"
      value={filterValue || 'All'}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {filteredOptions.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </Select>
  );
};

const SelectDatePickerFilter = ({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) => {
  const [min, max] = React.useMemo(() => {
    let min = new Date(preFilteredRows[0]?.values[id] ?? '1970-01-01').getTime();

    let max = new Date(preFilteredRows[0]?.values[id] ?? '1970-01-01').getTime();

    preFilteredRows.forEach((row) => {
      const currentDatetime = new Date(row.values[id]).getTime();

      min = currentDatetime <= min ? currentDatetime : min;
      max = currentDatetime >= max ? currentDatetime : max;
    });
    return [min, max];
  }, [id, preFilteredRows]);

  if (filterValue.length === 0) {
    setFilter;
  }

  const handleApply = (event, picker) => {
    picker.element.val(
      format(picker.startDate.toDate(), 'yyyy-MM-dd') +
        ' - ' +
        format(picker.endDate.toDate(), 'yyyy-MM-dd')
    );
    setFilter([picker.startDate.valueOf() / 1000, picker.endDate.valueOf() / 1000]);
  };

  const handleCancel = (event, picker) => {
    picker.element.val('');
    setFilter([min, max]);
  };

  return (
    <div className="flex font-normal mt-2">
      <DateRangePicker
        className="custom-picker"
        onApply={handleApply}
        onCancel={handleCancel}
        initialSettings={{
          showDropdowns: true,
          autoUpdateInput: false,
          locale: {
            cancelLabel: 'Clear',
          },
        }}
      >
        <input
          style={{ width: 190 }}
          type="text"
          className="form-control col-4 p-2"
          defaultValue=""
        />
      </DateRangePicker>
    </div>
  );
};

const query = gql`
  query ReportsQuery {
    incidents(sortBy: INCIDENT_ID_ASC, limit: 9999) {
      incident_id
      reports {
        title
        source_domain
        url
        authors
        submitters
        epoch_date_submitted
        epoch_date_modified
        epoch_date_downloaded
        report_number
        flag
      }
    }
  }
`;

export default function Incidents(props) {
  const [tableData, setTableData] = useState([]);

  const { data, loading } = useQuery(query);

  const { t } = useTranslation();

  useEffect(() => {
    if (!data) return;

    const incidentDataToCellMap = (data) => {
      const tableData = data.incidents.reduce((accumulator, incident) => {
        for (const report of incident.reports) {
          accumulator.push({
            ...report,
            incident_id: incident.incident_id,
            flag: report.flag === true ? 'Yes' : 'No',
            authors: report.authors.join(', '),
            __typename: undefined,
          });
        }
        return accumulator;
      }, []);

      return tableData;
    };

    setTableData(incidentDataToCellMap(data));
  }, [data]);

  const formatDateField = (date) => {
    return <>{date && <>{format(new Date(date * 1000), 'yyyy-MM-dd')}</>}</>;
  };

  const cellData = React.useMemo(() => tableData, [tableData]);

  const columns = React.useMemo(() => {
    let columns = [
      {
        title: t('Incident ID'),
        accessor: 'incident_id',
        Cell: ({ row: { values } }) => (
          <a className="flex items-center gap-2" href={`/cite/${values.incident_id}`}>
            <span>Incident {values.incident_id}</span>
            <FontAwesomeIcon icon={faLink} className="fas fa-link" />
          </a>
        ),
      },
      {
        className: 'min-w-[240px] max-w-[400px]',
        title: t('Incident Title'),
        accessor: 'title',
        Cell: (cell) => (
          <div
            className={`w-full min-w-[200px] m-0 p-0 overflow-auto cursor-pointer hover:bg-white`}
          >
            <Link to={cell.row.original.url}>{cell.row.values.title}</Link>
          </div>
        ),
      },
      {
        className: 'min-w-[240px]',
        title: t('Source Domain'),
        accessor: 'source_domain',
        width: 240,
      },
      {
        className: 'min-w-[240px]',
        title: t('Authors'),
        accessor: 'authors',
        width: 240,
      },
      {
        className: 'min-w-[240px]',
        title: t('Submitters'),
        accessor: 'submitters',
        width: 240,
        Filter: SelectColumnFilter,
      },
      {
        className: 'min-w-[240px]',
        title: t('Date Submitted'),
        accessor: 'epoch_date_submitted',
        width: 240,
        Filter: SelectDatePickerFilter,
        Cell: ({ row: { values } }) => {
          return <>{formatDateField(values.epoch_date_submitted)}</>;
        },
      },
      {
        className: 'min-w-[240px]',
        title: t('Date Modified'),
        accessor: 'epoch_date_modified',
        width: 240,
        Filter: SelectDatePickerFilter,
        Cell: ({ row: { values } }) => {
          return <>{formatDateField(values.epoch_date_modified)}</>;
        },
      },
      {
        className: 'min-w-[240px]',
        title: t('Date Downloaded'),
        accessor: 'epoch_date_downloaded',
        width: 240,
        Filter: SelectDatePickerFilter,
        Cell: ({ row: { values } }) => {
          return <>{formatDateField(values.epoch_date_downloaded)}</>;
        },
      },
      {
        className: 'min-w-[240px]',
        title: t('Report ID'),
        accessor: 'report_number',
        width: 240,
      },
      {
        className: 'min-w-[240px]',
        title: t('Flagged'),
        accessor: 'flag',
        width: 240,
        Filter: SelectColumnFilter,
        Cell: ({ row: { values } }) => {
          return <>{values.flag}</>;
        },
      },
    ];

    return columns;
  }, []);

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
      Header: DefaultColumnHeader,
    }),
    []
  );

  const filterDateFunction = (rows, id, filterValue) => {
    const start = filterValue[0];

    const end = filterValue[1];

    return rows.filter((val) => {
      return val.original[id] >= start && val.original[id] <= end;
    });
  };

  const filterTypes = {
    epoch_date_submitted: filterDateFunction,
    epoch_date_modified: filterDateFunction,
    epoch_date_downloaded: filterDateFunction,
  };

  const table = useTable(
    {
      columns,
      data: cellData,
      defaultColumn,
      filterTypes,
      initialState: { pageIndex: 0, pageSize: 100 },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  const { isCollapsed } = useMenuContext();

  return (
    <Layout {...props} sidebarCollapsed={true}>
      <AiidHelmet path={props.location.pathname}>
        <title>Incident List</title>
      </AiidHelmet>

      {loading && <ListSkeleton />}
      {!loading && (
        <div
          className={`max-w-[calc(100vw-298px) my-0 mx-auto overflow-auto whitespace-nowrap py-0 px-0 ${
            isCollapsed ? 'max-w-[100vw] md:pl-14' : 'md:pl-4'
          }`}
        >
          <h1 className="font-karla font-bold flex-1 pt-0">Incident Report Table</h1>
          <Button onClick={() => table.setAllFilters([])}>Reset filters</Button>
          <div className="py-4 pr-4 pl-0">
            <Table table={table} />
          </div>
        </div>
      )}
    </Layout>
  );
}
