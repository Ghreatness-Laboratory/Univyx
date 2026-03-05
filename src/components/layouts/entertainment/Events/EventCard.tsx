import { Calendar, Clock, MapPin } from "lucide-react";
import { EventProps } from "../../../../data/entertainment/events";
import { getImageUrl } from "../../../../utils/imageUrl";

interface EventCardProps {
  event: EventProps;
  className?: string;
}
export default function EventCard({ event, className }: EventCardProps) {
  return (
    <div
      className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      <div className="relative">
        <img
          src={getImageUrl(event.image)}
          alt={event.title}
          className="w-full h-60 object-cover"
        />
        <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
          {event.category}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-xl mb-3 hover:text-orange-600 transition-colors">
          {event.title}
        </h3>
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center text-sm">
            <Calendar size={16} className="text-gray-500 mr-2" />
            <span>{event.date}</span>
          </div>
          {(event as any).time && (
            <div className="flex items-center text-sm">
              <Clock size={16} className="text-gray-500 mr-2" />
              <span>{(event as any).time}</span>
            </div>
          )}
          <div className="flex items-start text-sm">
            <MapPin size={16} className="text-gray-500 mr-2 mt-1" />
            <span>{event.location}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-5 line-clamp-3">
          {event.description}
        </p>
      </div>
    </div>
  );
}
