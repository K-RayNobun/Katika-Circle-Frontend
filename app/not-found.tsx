import React from "react";
import Image from 'next/image';

export default function NotFound() {
    return (
        <main className="font-poppins_normal w-screen h-[100vh] flex flex-col items-center justify-center bg-gray gap-[48px]">
            <Image src="/404.png" alt="Error 404" width={400} height={400} className="mx-auto"/>
            <div className="flex flex-col items-center gap-[8px]">
                <h1 className="text-[32px] font-bold">Oops! This page cannot be found.</h1>
                <p className="text-[18px]">We cannot find the page you are looking for. You can return to the home page.</p>
                <button className="rounded-[12px] bg-primary text-white px-[16px] py-[12px] text-[16px] mt-[12px] drop-shadow-xl hover:bg-primary_dark hover:drop-shadow-none ">Back To Home Page</button>
            </div>
        </main>
    )
}