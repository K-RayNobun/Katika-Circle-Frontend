'use client'

// pages/index.js
// import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function QrCodeDialog({link}:{link:string}) {

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60">
        <div className="bg-primary p-6 rounded-lg shadow-lg w-[500px]">
            <h2>Share this QRCode for referring</h2>
            <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60">
                {link && (
                <QRCodeSVG value={link} size={256} color='#800FA7' />
                )}
            </div>
        </div>
    </div>
  );
}
