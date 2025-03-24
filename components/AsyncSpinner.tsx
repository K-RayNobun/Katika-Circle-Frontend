import React from "react";
import  PulseLoader from "react-spinners/PulseLoader";

const override =  {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

const AsyncSpinner =  () => {
    return (
        <div className="z-20 flex justify-center items-center transition-all duration-150 ease-in-out">
            <PulseLoader color="#fff" loading={true} cssOverride={override} size={12} aria-label="Loading Spinner" />
        </div>
    )
};

export default AsyncSpinner;