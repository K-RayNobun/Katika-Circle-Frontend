'use client'

import React from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import SockJs from "sockjs-client";
import { Stomp } from "@stomp/stompjs"

const WebsocketListener = () => {
    const accessToken = useAppSelector((state) => state.token.token);

    let stompClientRef = React.useRef<any>(null);

    const handleConnection = () => {
        console.log('Access Token => ', accessToken);
        console.log('------------  Requesting Connection -------------');

        const socket = new SockJs("https://test.sandbox.katika.io/ws");
        const stompClient = Stomp.over(socket);
        stompClientRef.current = stompClient;

        stompClient.connect(
            {
                Authorization: `Bearer ${accessToken}`,
                token: accessToken
            },
            () => {
                console.log("✅ Connected!");
                stompClient.subscribe("/topic/notifications", (message: any) => {
                    console.log("📩 Received message:", message.body);
                });
            },
            (error: any) => {
                console.error("❌ Connection error:", error);
            }
        );
    }

    // Optional disconnect logic
    React.useEffect(() => {
        return () => {
            const stompClient = stompClientRef.current;
            if (stompClient && stompClient.connected) {
                stompClient.disconnect(() => {
                    console.log("🧹 Disconnected on unmount");
                });
            }
        }
    }, []);

    return (
        <div className='w-full flex flex-col items-center justify-center gap-4 bg-fuchsia-100 text-xl '>
            <h2>Connect to the websocket and listen</h2>
            <h3>Available token ?: 
                <span className='font-bold'>
                    { accessToken ? 'Yes' : 'No' }
                </span>
            </h3>
            <button 
              className='rounded-xl px-4 py-2 shadow-md'
              onClick={handleConnection}
            >
                Connect
            </button>
        </div>
    );
}

export default WebsocketListener;