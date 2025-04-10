"use client";
import { useState } from "react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";

export default function Footer() {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim().length > 0) {
      alert("Message sent successfully");
      setMessage(""); // Clear the input after sending
    } else {
      alert("Please write your message");
    }
  };

  return (
    <footer className="bg-black text-white px-4 py-6 md:py-10">
      <div className="border-t border-gray-700 pt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Brand Info */}
        <div className="space-y-2 max-md:hidden">
          <h3 className="text-2xl font-bold text-white">ConTracker</h3>
          <p className="text-sm text-gray-400 max-w-sm">
            A blockchain-powered public works transparency platform. Track
            tenders, verify milestones, and ensure funds reach the right hands.
          </p>
        </div>

        {/* Quick Links */}
        <div className="max-md:hidden">
          <h4 className="text-xl font-semibold mb-3">Quick Links</h4>
          <ul className="text-sm text-gray-300 flex flex-col gap-2 md:gap-3">
            <li>
              <a
                href="/"
                className="hover:text-white transition-colors duration-200"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/about-us"
                className="hover:text-white transition-colors duration-200"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/services"
                className="hover:text-white transition-colors duration-200"
              >
                Services
              </a>
            </li>
          </ul>
        </div>

        {/* Contact + Social */}
        <div>
          <h4 className="text-xl font-semibold mb-3">Connect With Us</h4>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              placeholder="Write your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-2 rounded-full bg-gray-800 text-white border border-gray-600 placeholder-gray-400 text-sm focus:outline-none"
            />
            <button
              className="bg-teal-500 hover:bg-teal-600 p-2 rounded-full transition-all"
              onClick={handleSendMessage}
            >
              <IoIosSend size={20} />
            </button>
          </div>
          <div className="flex gap-4 mt-2 text-gray-400">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              <FaLinkedin size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              <FaTwitter size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Credit Line */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
        <p>
          Made with ❤️ by{" "}
          <span className="text-teal-400 font-semibold">Team Vibhav</span>
        </p>
      </div>
    </footer>
  );
}
