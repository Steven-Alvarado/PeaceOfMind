import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

interface FooterLandingPageProps {
  style?: React.CSSProperties;
}

const FooterLandingPage: React.FC<FooterLandingPageProps> = ({ style }) => {
  return (
    <footer className="bg-[#5E9ED9] text-white p-8" style={style}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold mb-2">About Us</h2>
          <p className="text-sm leading-relaxed">
            CS490 Group 1 is committed to delivering innovative solutions that
            make a difference. Our team values creativity, collaboration, and
            excellence in every project we undertake.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <a href="#home" className="hover:underline text-sm">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="hover:underline text-sm">
                About Us
              </a>
            </li>
            <li>
              <a href="#services" className="hover:underline text-sm">
                Services
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:underline text-sm">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className="text-center md:text-right">
          <h2 className="text-lg font-semibold mb-2">Follow Us</h2>
          <div className="flex justify-center md:justify-end space-x-4">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition"
            >
              <FaLinkedin size={20} />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition"
            >
              <FaInstagram size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white mt-8 pt-4 text-center text-sm">
        <p>© 2024 CS490 Group 1. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default FooterLandingPage;
