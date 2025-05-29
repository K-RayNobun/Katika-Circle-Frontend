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
                            href="https://api.whatsapp.com/send?phone=237679143281&text=Hello%20Service%20Client%20de%20SendbyKatika%2C%20j%E2%80%99ai%20rencontr%C3%A9%20un%20probl%C3%A8me%20sur%20Katika%20Wallet%20et%20j%E2%80%99aimerais%20avoir%20de%20l%E2%80%99aide.%0AVoici%20quelques%20d%C3%A9tails%20pour%20mieux%20comprendre%20%3A%0A%0ANom%20%3A%0A%0AAdresse%20email%20utilis%C3%A9e%20sur%20Katika%20%3A%0A%0ADescription%20du%20probl%C3%A8me%20%3A%0A%0AMerci%20de%20votre%20aide%20%21"
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
