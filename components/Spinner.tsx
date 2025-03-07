import React from "react";
import  PuffLoader from "react-spinners/PuffLoader";

const override =  {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

const Spinner =  () => {
    return (
        <div className="absolute z-50 flex justify-center items-center w-screen bg-gray h-screen transition-all duration-150 ease-in-out">
            <PuffLoader color="#931ABD" loading={true} cssOverride={override} size={150} aria-label="Loading Spinner" />
        </div>
    )
};

export default Spinner;