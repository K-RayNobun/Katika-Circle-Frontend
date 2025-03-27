'use client'

import { useState } from "react";
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';


const FetchData = () => {
  
  
  const [error, setError] = useState(null);
  setError(null);
  

  const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5qb3lhanVuaW9yNzc3QGdtYWlsLmNvbSIsInN1YiI6Im5qb3lhanVuaW9yNzc3QGdtYWlsLmNvbSIsImV4cCI6MTc0MzA4OTY3Mn0.f2HA8AlfN5uT14UZJ_4Pin_L05icxl49uRd3PD65Pb0FETbZFzzImpx-784GUZuBzGsnirtBbmrfj0ZVThFX8w"; // Mets ici un token sécurisé

  const {data: data, isLoading} = useQuery({
    queryFn: async() => await axios.get(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/v1/transactions`, 
      {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        }
      }
    ),
    queryKey: ['data'],
  });

  if (isLoading) {
    return <div className="text-[20px] font-semibold text-primary text-center"> Loading ...</div>
  }

  return (
    <div>
      <h1 className={`text-[24px] text-center`}>React Query Sample</h1>
      {error && <p className="text-red-500">Erreur : {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default FetchData;
