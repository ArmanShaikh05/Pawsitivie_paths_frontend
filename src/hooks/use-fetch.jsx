import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetch = (url,reducerValue) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);   // Start loading
      try {
        const response = await axios.get(url);
        setData(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.message); 
        setData(null); 
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, [url,reducerValue]); 

  return { data, loading, error };
};

export default useFetch;