'use client';

// // I am whole perfect strong pwoerful loving harmonious and happy

// import React, { useState, useEffect, useRef} from 'react';
// import axios from 'axios';

// const Test = () => {

//   const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhlcmFjbGVzMTJ0aEBnbWFpbC5jb20iLCJzdWIiOiJoZXJhY2xlczEydGhAZ21haWwuY29tIiwiZXhwIjoxNzQxMjYzNjI4fQ.8aScJySWFXlCTdiwbAZ6GoEF2ihK78zn3jrZjcP4VCuUuZG-SBds59Z3R8BJn3glGngl2HaxOOCZigcKGy8bxA";
//   const [userName, setUserName] = useState<string>();
  
//   const [timeLeft,setTimeLeft] = useState(60);
//   const intervalRef = useRef<NodeJS.Timeout>(undefined);

//   useEffect(() => {
//       intervalRef.current = setInterval(() => {
//           setTimeLeft((prevTime) => {
//               if (prevTime === 0) {
//                   clearInterval(intervalRef.current);
//                   return prevTime;
//               }
//               return prevTime - 1;
//           })
//       }, 1000);

//       return () => clearInterval(intervalRef.current);
//   })

//   const fetchToken = async() => {
//     console.log('Fetching token...');
//     try {
//       const response  = await axios.post('https://blank-lynde-fitzgerald-ef8fba55.koyeb.app/auth/account/login',{
//         email: 'heracles12th@gmail.com',
//         pwd: '000000'
//       }, {
//         headers: {
//           "Content-Type": "application/json",
//           "Access-Control-Allow-Origin": "*"
//         }
//       });
//       const user_name = response.data.data
//       console.log('Token is:', user_name);
//       setUserName(user_name);
//     } catch (error) {
//       console.error('Token is unavailable with this config', error);
//     }
//   };

//   return (
//     <div className='min-h-screen flex flex-col max-h-[1200px] bg-gray_dark px-4 space-y-8'>
//       <h5 className='text-center my-8 text-4xl font-bold'>Training</h5>
//       <div className='flex flex-col space-y-[24px] items-center justify-center rounded-lg p-8 w-full h-[200px] bg-stone-200'>
//         { userName && <h5 className='text-2xl text-fuchsia-700 font-bold'>Hey {userName}</h5> }
//         <button onClick={fetchToken} className='rounded-[16px] bg-gray_dark text-stone-100 px-3 py-2 text-2xl font-semibold' >Get Token</button>
//       </div>
//       <div className='flex flex-col space-y-[24px] items-center justify-center rounded-lg p-8 w-full min-h-[200px] bg-rose-400'>
//          <h3 className='text-2xl text-blue-200'>Time left: <br /> {timeLeft} </h3>
//       </div>
//       <div className='rounded-lg p-8 w-full min-h-[200px] bg-fuchsia-400'>
//         <div className='w-full bg-gray_dark flex items-center gap-[4px] mt-[20px]'>
//             <img src='/path/to/image.png' alt='Image' className='w-[30px]' />
//             <input type='text' className='grow w-auto px-[14px] py-[8px] border-2 border-gray-400 rounded-[8px]' />
//             <span className='font-semibold w-[24px]'>505</span>
//         </div>
//       </div>
//       <div className='rounded-lg p-8 w-full bg-black/50 overflow-auto'>
//         {
//           Array.from({length: 15}, (_, i) => {
//             return (
//               <div className='my-2 mx-2 text-sm px-3 w-full rounded-lg h-xl bg-white'> Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam libero facere unde.</div>
//             )
//           })
//         }
//       </div>
//       <div className='rounded-lg p-8 w-full h-[200px] bg-blue-400'></div>

//     </div>
//   )
// }

// export default Test


import React, {useEffect, useState} from 'react';

const FadeInSlideUp = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the animation after the component mounts
    setIsVisible(true);
  }, []);

  return (
    <div
      className={``}
    >
      {children}
    </div>
  );
};

const App = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-[20px] bg-gray-100">
      <FadeInSlideUp>
        <div className="p-6 animate-fading-1 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold">Hello, World 01!</h1>
          <p className="text-gray-600">This component fades in and slides up.</p>
        </div>
      </FadeInSlideUp>
      <FadeInSlideUp>
        <div className="p-6 animate-fading-2 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold">Hello, World 02!</h1>
          <p className="text-gray-600">This component fades in and slides up.</p>
        </div>
      </FadeInSlideUp>
      <FadeInSlideUp>
        <div className="p-6 animate-fading-3 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold">Hello, World 03!</h1>
          <p className="text-gray-600">This component fades in and slides up.</p>
        </div>
      </FadeInSlideUp>
    </div>
  );
};

export default App;

