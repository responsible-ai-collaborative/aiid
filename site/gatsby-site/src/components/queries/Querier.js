import { Dropdown } from 'flowbite-react';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import React, { useCallback, useEffect, useState } from 'react'
import { StringParam, useQueryParams } from 'use-query-params';
import queryTypes from 'components/queries/queryTypes';

const queryConfig = {
    s: StringParam,
}

export default function Querier() {

    const [query, setQuery] = useQueryParams(queryConfig);

    const { locale } = useLocalization();

    const [filters, setFilters] = useState([]);


    const addFilter = useCallback((type) => {

        const count = filters.filter(filter => filter.type === type).length;
        const id = `${type}-${count}`;

        setFilters(filters => [...filters, { type, id }])

    }, [filters]);


    useEffect(() => {

        for (const filter of filters) {

        }

    }, [filters]);

    return <>
        <div>
            <Dropdown
                label={"Add item"}
                color={'light'}
                className="min-w-max"
            >
                <Dropdown.Item
                    key={'direct'}
                    onClick={() => addFilter('direct')}
                >
                    Direct
                </Dropdown.Item>
            </Dropdown>

        </div>
        <div>
            {filters.map(filter => {

                const Component = queryTypes[filter.type].default;

                return <Component key={filter.id} setFilters={setFilters} {...filter} />
            })}
        </div></>
}