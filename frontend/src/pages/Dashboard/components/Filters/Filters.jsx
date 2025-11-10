import React from 'react';

const Filters = ({ filterOptions = {}, filters, setFilters }) => {
    console.log("filter render ")

    return (
        <>
            {Object.entries(filterOptions).map(([key, options]) => (
                <select
                    key={key}
                    value={filters[key] ?? ''}
                    onChange={(e) => setFilters(prev => ({
                        ...prev,
                        [key]: key === 'year' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value
                    }))}
                >
                    <option value="">{`All ${key}s`}</option>
                    {options.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            ))}
        </>
    );
};

export default React.memo(Filters);
