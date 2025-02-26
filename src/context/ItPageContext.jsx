import React, { createContext, useState, useEffect ,useMemo} from 'react';
import axios from 'axios';
import db from "../../public/db/db.json";
import PropTypes from 'prop-types';
const ITContext = createContext();

const ITProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => { 
        try {
            // const response = await axios.get('/path/to/db.json');
            const response =  await db.itData;
            setData(response);
            setFilteredData(response);
            return response // Initially, filtered data is the same as fetched data
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const filterData = (criteria) => {
        const filtered = data.filter(item => item.criteria === criteria);
        setFilteredData(filtered);
    };

    const updateData = async (id, updatedItem) => {
        try {
            const response = await axios.put(`/path/to/db.json/${id}`, updatedItem);
            const updatedData = data.map(item => (item.id === id ? response.data : item));
            setData(updatedData);
            setFilteredData(updatedData);
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const contextValue = useMemo(() => ({
        data,
        filteredData,
        fetchData,
        filterData,
        updateData
    }), [data, filteredData]);

    return (
        <ITContext.Provider value={contextValue}>
            {children}
        </ITContext.Provider>
    );
};

export { ITContext, ITProvider };

ITProvider.propTypes = {children: PropTypes.node.isRequired};