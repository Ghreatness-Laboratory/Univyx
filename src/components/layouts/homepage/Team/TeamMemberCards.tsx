import { FacebookLogo, InstagramLogo, TwitterLogo, GithubLogo, LinkedinLogo } from "phosphor-react";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import api from "../../../../services/api";

interface TeamMemberProps {
  _id: string;
  name: string;
  role: string;
  image?: string;
  bio?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  order: number;
}

interface TeamMemberCardsProps {
  selectedRole: string;
}

export default function TeamMemberCards({ selectedRole }: TeamMemberCardsProps) {
  const sliderRef = useRef<Slider>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMemberProps[]>([]);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await api.getTeamMembers();
      setTeamMembers(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    }
  };

  const filteredMembers =
    selectedRole === "All"
      ? teamMembers
      : teamMembers.filter((member) => member.role === selectedRole);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(filteredMembers.length, 3),
    slidesToScroll: 1,
    arrows: false,
    autoplay: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: Math.min(filteredMembers.length, 2),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(filteredMembers.length, 2),
          slidesToScroll: 1,
        },
      },
    ],
    dotsClass: "slick-dots custom-dots",
    appendDots: (dots: React.ReactNode) => <ul>{dots}</ul>,
    customPaging: () => (
      <div className="w-2.5 h-2.5 bg-gray-300 rounded-full hover:bg-primary transition-colors duration-300 mt-6 md:mt-8"></div>
    ),
  };

  return (
    <div className="relative my-3 max-w-7xl w-full mx-auto px-6 md:px-4">
      {filteredMembers.length > 0 && (
        <>
          <Slider
            ref={sliderRef}
            {...settings}
            className="team-member-slider px-1 sm:px-0"
          >
            {filteredMembers.map((member) => (
              <div key={member._id} className="px-1 sm:px-3 w-full">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 sm:p-5 rounded-lg sm:rounded-xl bg-[#F9F9FB] h-full">
                  <div className="w-full h-[100px] sm:w-[130px] sm:h-[130px] md:w-[150px] md:h-[150px] flex-shrink-0 overflow-hidden">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        role="img"
                        aria-label={`Photo of ${member.name}`}
                        className="w-full h-full object-cover rounded-md sm:rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-md sm:rounded-lg flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-600">{member.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 mt-4 sm:mt-0 text-center sm:text-left">
                    <h6 className="text-primary text-base sm:text-xl leading-[17.35px] sm:leading-6 font-medium">
                      {member.name}
                    </h6>
                    <span className="text-secondary text-sm sm:text-base font-normal my-2">
                      {member.role}
                    </span>
                    {member.bio && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{member.bio}</p>
                    )}
                    {member.social && (
                      <div className="flex max-md:justify-center gap-4 mt-2">
                        <div className="flex items-start gap-[5.42px] sm:gap-2.5">
                          {member.social.twitter && (
                            <a
                              href={member.social.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Twitter"
                            >
                              <TwitterLogo size={20} />
                            </a>
                          )}
                          {member.social.linkedin && (
                            <a
                              href={member.social.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="LinkedIn"
                            >
                              <LinkedinLogo size={20} />
                            </a>
                          )}
                          {member.social.github && (
                            <a
                              href={member.social.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="GitHub"
                            >
                              <GithubLogo size={20} />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </>
      )}

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-secondary text-lg">
            No team members with this role found.
          </p>
        </div>
      )}

      <style>
        {`
          .team-member-slider .slick-track {
            display: flex !important;
          }
          .team-member-slider .slick-slide {
            height: inherit !important;
            display: flex !important;
          }
          .team-member-slider .slick-slide > div {
            display: flex;
            height: 100%;
            width: 100%;
          }
          .custom-dots {
            bottom: -40px !important;
          }
          .custom-dots li {
            margin: 0 5px;
          }
          .custom-dots li.slick-active div {
            background-color: #0D0D0D;
          }
        `}
      </style>
    </div>
  );
}
