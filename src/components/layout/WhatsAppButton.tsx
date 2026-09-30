import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
    const phoneNumber = '94767674827';
    const message = encodeURIComponent('Hi! I\'m interested in planning a trip to Sri Lanka. Can you help me?');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 group"
            aria-label="Chat on WhatsApp"
        >
            <div className="relative">
                {/* Pulse animation */}
                <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25"></div>

                {/* Button */}
                <div className="relative w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-green-600 transition-all duration-300 hover:scale-110">
                    <MessageCircle size={28} className="text-white" fill="currentColor" />
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-surface-800 text-white text-sm px-4 py-2 rounded-xl whitespace-nowrap shadow-lg">
                        Chat with us on WhatsApp
                        <div className="absolute top-full right-6 w-2 h-2 bg-surface-800 rotate-45 -mt-1"></div>
                    </div>
                </div>
            </div>
        </a>
    );
}
