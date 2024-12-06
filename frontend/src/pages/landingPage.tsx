import { useEffect, useState } from "react";
import axios from "axios";

import "../assets/styles/index.css";
import { Typewriter } from "react-simple-typewriter";
import HeaderLandingPage from "../components/HeaderLandingPage";
import FooterLandingPage from "../components/Footer";
import Logo from "../assets/images/logobetter.png";

import { motion } from "framer-motion";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FaStar,
  FaEnvelope,
  FaPhoneAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";

import Lottie from "lottie-react";
import AboutAnimation from "../assets/lotties/AboutLandingPage.json";
import Advice1 from "../assets/lotties/AdviceSection1.json";
import Advice2 from "../assets/lotties/AdviceSection2.json";
import Advice3 from "../assets/lotties/AdviceSection3.json";

function LandingPage() {
  return (
    <div>
      <HeaderLandingPage />
      <IntroSection />
      <AboutSection />
      <AdviceSection />
      <FAQSection />
      <ReviewsSection />
      <ContactSection />
      <FooterLandingPage />
    </div>
  );
}
function IntroSection() {
  return (
    <section
      className="relative flex flex-col items-center overflow-hidden"
      style={{ minHeight: "90vh" }}
    >
      <div className="wave-background absolute inset-0 w-full h-full bg-cover bg-bottom z-[-1]"></div>

      <div className="relative z-0 text-center flex flex-col items-center">
        <h1 className="text-7xl font-extrabold text-[#5E9ED9] mt-44">
          Peace of Mind
        </h1>

        <div className="w-48 h-48 my-4">
          <img
            src={Logo}
            alt="Peace of Mind Logo"
            className="w-full h-full object-contain hover:scale-175 scale-150 rounded-full"
          />
        </div>

        <h2 className="text-3xl text-[#5E9ED9] p-2 font-semibold">
          <Typewriter
            words={[
              "A Place to Find Your Calm",
              "Your Journey to Peace Starts Here",
              "Discover Tranquility",
            ]}
            loop={true}
            cursor
            cursorStyle="_"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={2000}
          />
        </h2>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex items-center justify-center py-16 bg-blue-100 overflow-hidden"
    >
      <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-white rounded-full"></div>

      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-center z-40">
        <motion.div
          className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div
            className="rounded-full overflow-hidden bg-white p-4 shadow-lg"
            style={{ width: "400px", height: "400px" }}
          >
            <Lottie
              animationData={AboutAnimation}
              loop={true}
              style={{ height: "100%", width: "100%" }}
            />
          </div>
        </motion.div>

        <motion.div
          className="w-full md:w-1/2 md:pl-10 text-center md:text-left"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4 text-center text-[#5E9ED9]">
            About Us
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            We are dedicated to providing affordable therapy services tailored
            for college students. With a focus on reducing stress and improving
            mental well-being, we offer licensed therapists that students can
            talk to at their convenience.
          </p>
          <div className="space-y-4">
            <div className="flex items-start hover:scale-105 transition-transform">
              <span className="text-blue-500 mr-3">💬</span>
              <p className="text-gray-700">
                <span className="font-semibold">Therapy Services:</span> Access
                licensed therapists anytime.
              </p>
            </div>
            <div className="flex items-start hover:scale-105 transition-transform">
              <span className="text-blue-500 mr-3">📓</span>
              <p className="text-gray-700">
                <span className="font-semibold">Journaling:</span> Reflect on
                your thoughts and emotions daily.
              </p>
            </div>
            <div className="flex items-start hover:scale-105 transition-transform">
              <span className="text-blue-500 mr-3">📊</span>
              <p className="text-gray-700">
                <span className="font-semibold">Analytics:</span> Track your
                mental health progress over time.
              </p>
            </div>
            <div className="flex items-start hover:scale-105 transition-transform">
              <span className="text-blue-500 mr-3">📅</span>
              <p className="text-gray-700">
                <span className="font-semibold">Daily Surveys:</span> Answer
                short surveys to help you stay in tune with your well-being.
              </p>
            </div>
          </div>

          <div className="justify-center flex">
            <a href="/sign-up">
              <button className="mt-6 px-6 py-2 shadow-md bg-[#5E9ED9] text-white rounded-lg hover:bg-[#4690d6] transition-colors">
                Get Started
              </button>
            </a>
          </div>

          <p className="mt-6 italic text-gray-500">
            "Peace of Mind has helped me stay grounded and manage my stress
            through college. Highly recommended!"
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function AdviceSection() {
  const adviceData = [
    {
      id: 1,
      title: "Stay Organized",
      animation: Advice1,
      description: [
        {
          emoji: "📅",
          text: "Create a weekly planner to track assignments and deadlines.",
        },
        {
          emoji: "✅",
          text: "Set small, achievable goals to keep yourself motivated.",
        },
      ],
    },
    {
      id: 2,
      title: "Prioritize Self-Care",
      animation: Advice2,
      description: [
        {
          emoji: "🛌",
          text: "Ensure you get enough rest; a well-rested mind is more productive.",
        },
        {
          emoji: "💆",
          text: "Take short breaks to relax and recharge during study sessions.",
        },
      ],
    },
    {
      id: 3,
      title: "Set Realistic Goals",
      animation: Advice3,
      description: [
        {
          emoji: "🎯",
          text: "Break down long-term goals into smaller, manageable tasks.",
        },
        {
          emoji: "📝",
          text: "Review and adjust your goals periodically to stay on track.",
        },
      ],
    },
  ];

  return (
    <section
      id="advice"
      className="relative flex items-center justify-center py-16 bg-white overflow-hidden"
    >
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-blue-100 rounded-full"></div>
      <div className="absolute z-0 -bottom-32 -right-32 w-96 h-96 bg-blue-100 rounded-full"></div>

      <div className="z-40">
        <h2 className="text-4xl font-bold text-center mb-12 text-[#5E9ED9]">
          Advice
        </h2>
        <div className="space-y-8">
          {adviceData.map((advice) => (
            <motion.div
              key={advice.id}
              className="flex flex-col md:flex-row items-center bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#5E9ED9] rounded-3xl bg-opacity-20 mr-6">
                <div className="w-40 h-40 md:w-48 md:h-48 flex-shrink-0 rounded-md overflow-hidden ">
                  <Lottie
                    animationData={advice.animation}
                    loop={true}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </div>

              <div className="w-full">
                <h3 className="text-2xl font-semibold text-[#5E9ED9] mb-2">
                  {advice.title}
                </h3>
                <ul className="text-gray-700 font-medium space-y-2">
                  {advice.description.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">{item.emoji}</span>
                      <p>{item.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

type FAQ = {
  id: number;
  question: string;
  answer: string;
};

function FAQSection() {
  const faqData: FAQ[] = [
    {
      id: 1,
      question: "What is Peace of Mind?",
      answer:
        "Peace of Mind is a mental health platform designed for college students, offering affordable access to licensed therapists, daily journaling, progress tracking, and self-care resources.",
    },
    {
      id: 2,
      question: "How can I access therapy sessions?",
      answer:
        "You can schedule therapy sessions through our platform. After signing up, you’ll have access to a network of licensed therapists ready to help you at your convenience.",
    },
    {
      id: 3,
      question: "Is Peace of Mind affordable for students?",
      answer:
        "Yes, Peace of Mind was created with students in mind, offering cost-effective therapy options and free resources to help manage stress and mental well-being.",
    },
    {
      id: 4,
      question: "How does journaling help with mental health?",
      answer:
        "Journaling helps you process thoughts and emotions, track your mental health progress, and understand your stress patterns. Our platform provides prompts and reminders to make it easy to start.",
    },
    {
      id: 5,
      question: "Can I track my mental health progress?",
      answer:
        "Yes, Peace of Mind includes an analytics tool that tracks your daily check-ins, mood logs, and other self-care activities to help you visualize your mental health journey.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative flex items-center justify-center py-16 bg-blue-100 overflow-hidden"
    >
      <div className="absolute -top-28 -left-28 w-64 h-64 bg-white rounded-full "></div>
      <div className="absolute z-0 -bottom-20 -right-20 w-80 h-80 bg-white rounded-full "></div>

      <div className="container mx-auto px-6 md:px-12 z-40">
        <h2 className="text-4xl font-bold text-center mb-12 text-[#5E9ED9]">
          FAQ
        </h2>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <motion.div
              key={faq.id}
              className="bg-white rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left text-xl font-bold text-[#5E9ED9] flex justify-between items-center focus:outline-none"
              >
                {faq.question}
                <span>{activeIndex === index ? "▲" : "▼"}</span>
              </button>
              {activeIndex === index && (
                <motion.div
                  className="px-6 py-4 text-gray-700 text-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {faq.answer}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewsSection() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("/api/reviews");
        const reviewData = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setReviews(reviewData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const settings = {
    centerMode: true,
    infinite: true,
    slidesToShow: 3,
    speed: 500,
    dots: true,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 9000,
    draggable: true,
  };

  return (
    <section
      id="reviews"
      className="relative py-16 bg-white flex items-center justify-center overflow-hidden"
      style={{ paddingTop: "4rem", paddingBottom: "4rem" }}
    >
      <div className="absolute w-96 z-0 h-96 bg-blue-100 rounded-full -top-20 -left-20"></div>
      <div className="absolute w-72 z-0 h-72 bg-blue-100 rounded-full -bottom-20 -right-20"></div>

      <motion.div
        className="container mx-auto px-6 md:px-12 z-40"
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold text-center mb-12 text-[#5E9ED9]">
          Reviews
        </h2>
        {isLoading ? (
          <div className="text-center text-gray-500">Loading reviews...</div>
        ) : reviews.length > 0 ? (
          <Slider {...settings} className="p-8 bg-[#5E9ED9] rounded-xl">
            {reviews.map((review) => {
              const truncatedDate = review.updated_at.split("T")[0];

              return (
                <div
                  key={review.id}
                  className="p-8 bg-blue-50 rounded-lg space-x-4 shadow-md flex flex-col text-center"
                >
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                      <span className="text-gray-600">Picture</span>
                    </div>
                  </div>
                  <strong>
                    {review.first_name} {review.last_name}
                  </strong>
                  <p className="text-sm text-gray-700">{truncatedDate}</p>
                  <p className="text-gray-700 mt-4 mb-6 max-w-md">
                    {review.review_text}
                  </p>
                  <div className="flex justify-center mb-4">
                    {Array.from({ length: review.rating }, (_, i) => (
                      <FaStar key={i} className="text-yellow-500" />
                    ))}
                    {Array.from({ length: 5 - review.rating }, (_, i) => (
                      <FaStar key={i} className="text-gray-300" />
                    ))}
                  </div>
                </div>
              );
            })}
          </Slider>
        ) : (
          <div className="text-center text-gray-500">No reviews available.</div>
        )}
      </motion.div>
    </section>
  );
}

function ContactSection() {
  return (
    <section
      id="contact"
      className="py-16 bg-blue-100 flex flex-col items-center justify-center text-center relative overflow-hidden"
    >
      <div className="absolute w-64 h-64 bg-white rounded-full -top-20 -left-40"></div>
      <div className="absolute w-48 h-48 bg-[#5E9ED9]  translate-x-64 rounded-full -bottom-36"></div>

      <motion.h2
        className="text-4xl font-bold text-[#5E9ED9] mb-8"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Contact Us
      </motion.h2>

      <motion.div
        className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-12 mb-12"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center space-x-4">
          <FaEnvelope className="text-[#5E9ED9] text-2xl" />
          <span className="text-gray-700 font-medium text-lg">
            peaceofmind@therapy.com
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <FaPhoneAlt className="text-[#5E9ED9] text-2xl" />
          <span className="text-gray-700 font-medium text-lg">
            1-800-PeaceOfMind
          </span>
        </div>
      </motion.div>
      <motion.div
        className="flex space-x-6 text-[#5E9ED9] text-2xl"
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <FaFacebook className="hover:text-[#538cc3] cursor-pointer" />
        <FaTwitter className="hover:text-[#538cc3] cursor-pointer" />
        <FaLinkedin className="hover:text-[#538cc3] cursor-pointer" />
      </motion.div>
    </section>
  );
}

export default LandingPage;
