'use client'

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import NotFound from './not-found';

export default function RouteHandler({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathName = usePathname();
  const [isValidRoute, setIsValidRoute] = useState(true);

  // Define valid routes
  const validRoutes = [
    '/',
    '/user/home',
    '/user/transactions',
    '/user/awards',
    '/user/settings',
    '/auth/signup',
    '/auth/signin',
    '/auth/welcome',
    '/auth/pincheck',
    // Add other valid routes here
  ];

  useEffect(() => {
    console.log('Current pathName:', pathName);
    validRoutes.some(route => {
    const isValid = ( pathName === route || (pathName.startsWith(route) && route !== '/'));
    console.log(`----------- Route ${route} -------------`);
    console.log(`>>> Path ${pathName} is ${isValid ? 'valid' : 'invalid'}`);
    setIsValidRoute(isValid);
    if(isValid) {
      router.push(route);
      return true
    }
    })
  }, [pathName, router]);

  // Render 404 for invalid routes
  if (!isValidRoute) {
    return <NotFound />;
  }

  // Render children for valid routes
  return <>{children}</>;
}