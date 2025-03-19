// components/ClientWrapper.tsx
"use client"; // Mark this as a Client Component

import { useState, useEffect } from "react";
import Spinner from "./Spinner";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a 2-second loading delay
    // console.log( 'Spinner start...');
    const timer = setTimeout(() => {
      setLoading(false);
      // console.log('Now the loading should disappear')
    }, 1000);
    // console.log('Passed the delay')

    // Cleanup the timer
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        children
      )}
    </>
  );
}