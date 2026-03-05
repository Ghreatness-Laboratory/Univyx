import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef } from "react";
import Slider from "react-slick";
import { Event } from "../../../../types/api";
import EventCard from "./EventCard";

interface UpcomingEventsSectionProps {
  upcomingEvents: Event[];
  loading?: boolean;
}

const Events: React.FC<UpcomingEventsSectionProps> = ({ upcomingEvents, loading }) => {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="max-w-[1120px] w-full mx-auto flex flex-col gap-[50px] py-12 md:py-[100px] px-6 lg:px-0">
      <div className="mb-8">
        <h2 className="text-4xl md:text-5xl font-semibold">Upcoming Events</h2>
        <p className="text-secondary text-lg mt-1">
          Latest gaming tournaments and meetups happening on campus
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <p className="text-gray-500">Loading events...</p>
        </div>
      ) : !upcomingEvents || upcomingEvents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No upcoming events at the moment</p>
        </div>
      ) : (
        <>
          <div className="relative">
            <Slider ref={sliderRef} {...settings}>
              {upcomingEvents.map((event) => (
                <div key={event._id} className="px-2">
                  <EventCard event={event} />
                </div>
              ))}
            </Slider>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="p-2 bg-white rounded-full shadow border hover:bg-gray-100 transition"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="p-2 bg-white rounded-full shadow border hover:bg-gray-100 transition"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Events;
