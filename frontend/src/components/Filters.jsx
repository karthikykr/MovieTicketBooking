import React from 'react';

const Filters = () => {
    return (
        <div className="flex space-x-4 p-4 bg-gray-100">
            <input
                type="text"
                placeholder="Search Movies"
                className="border p-2 rounded w-1/3"
            />
            <select className="border p-2 rounded">
                <option>All Genres</option>
                <option>Action</option>
                <option>Drama</option>
                <option>Comedy</option>
            </select>
        </div>
    );
};

export default Filters;
