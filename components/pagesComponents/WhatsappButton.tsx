import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsappButton = () => {
    const [showOptions, setShowOptions] = React.useState(false);

    return (
        <div className="bg-white border-4 border-green/60 p-2 rounded-full fixed bottom-20 lg:bottom-6 right-6 z-50">
            {/* WhatsApp Button */}
            <button
                className={`bg-green-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300 ${ showOptions ? "scale-110" : ""}`}
                onClick={() => setShowOptions(!showOptions)}
            >
                <FaWhatsapp size={40} className="text-green" />
            </button>
            {/* Options: Join Whatsapp Group;  Contacts us */}
            <div id="options" className="relative">
                {showOptions && (
                    <div className="absolute w-[180px] top-[-158px] -right-5 bg-white shadow-lg rounded-lg p-1 mt-2">
                        <a
                            href="https://api.whatsapp.com/send?phone=679143281&text=Salut%2C%20M.%20Ricardo%21%20Pouvez-vous%20m%27aider%20%C3%A0%20..."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-green hover:text-white hover:bg-green/40 p-2 mb-1 rounded-lg"
                        >
                            Contact Us
                        </a>
                        <a
                            href="https://chat.whatsapp.com/EnGGXEVsEDbDzBXHXPAwgP"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-green-500 hover:text-green hover:bg-gray p-2 rounded-lg"
                        >
                            Join WhatsApp Group
                        </a>
                    </div>
                )} 
            </div>
                
        </div>
    )
}

export default WhatsappButton;
