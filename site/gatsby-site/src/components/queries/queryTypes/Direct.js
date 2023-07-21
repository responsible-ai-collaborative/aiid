import { Textarea } from 'flowbite-react';
import React from 'react';

export default function Direct({ id, setFilters, text }) {

    const handleChange = (e) => {

        setFilters(filters => filters.map(filter => {
            if (filter.id === id) {
                return {
                    ...filter,
                    text: e.target.value,
                }
            }

            return filter;
        }))
    }

    return <div>
        <Textarea value={text} onChange={handleChange} />
    </div>
}


const defaults = {
    query: '',
}

function getQuery({ text }) {

    return text;
}

export { getQuery, defaults };