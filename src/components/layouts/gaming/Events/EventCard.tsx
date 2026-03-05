import React from "react";
import { Event } from "../../../../types/api";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const imageUrl = event.image?.startsWith('http') 
    ? event.image 
    : `https://univyx-backend-1xfv.onrender.com${event.image}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={imageUrl}
        alt={event.title}
        className="w-full h-80 object-cover transition-transform hover:scale-102"
      />

      <div className="p-4">
        <h3 className="text-base font-semibold truncate">{event.title}</h3>
        <p className="mt-2 text-sm text-gray-600">
          {new Date(event.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
