'use client'

import { useEffect, useState } from "react";
import axios from 'axios';

const FetchData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5qb3lhanVuaW9yNzc3QGdtYWlsLmNvbSIsInN1YiI6Im5qb3lhanVuaW9yNzc3QGdtYWlsLmNvbSIsImV4cCI6MTc0MzA4OTY3Mn0.f2HA8AlfN5uT14UZJ_4Pin_L05icxl49uRd3PD65Pb0FETbZFzzImpx-784GUZuBzGsnirtBbmrfj0ZVThFX8w"; // Mets ici un token sécurisé

  useEffect(() => {
    axios.get("https://blank-lynde-fitzgerald-ef8fba55.koyeb.app/api/v1/transactions", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Access-Controle-Allow-Origin": '*',
      }
    })
    .then(response => {
      setData(response.data);
      setLoading(false);
    })
    .catch(error => {
      setError(error.message);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1>Transactions</h1>
      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">Erreur : {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default FetchData;
