import React from "react";
import Image from 'next/image';
import Link from "next/link";

export default function NotFound() {
    return (
        <main className="font-poppins_normal w-screen h-[100vh] flex flex-col items-center justify-center bg-gray gap-[48px]">
        <Image 
            src="/404.png" 
            alt="Error 404" 
            width={400} 
            height={400} 
            className="mx-auto"
            priority
            unoptimized
        />
        <div className="flex flex-col items-center gap-[8px]">
            <h1 className="text-[32px] font-bold text-primary">Page Not Found</h1>
            <p className="text-[18px] text-gray_dark">
            The page you are looking for doesn&apos;t exist or has been moved.
            </p>
            <Link 
            href="/user/home" 
            className="mt-4 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90"
            >
            Back to Home
            </Link>
        </div>
        </main>
    )
}