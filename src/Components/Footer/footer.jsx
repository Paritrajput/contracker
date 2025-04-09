// components/Footer.jsx
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";

export default function Footer() {
  return (
    <footer className="bg-black text-white md:py-10 py-5 px-3">
      <div className="md:mx-5 mx-1  grid grid-cols-1 md:grid-cols-3 md:gap-8 gap-4 border-t md:p-5 p-1 border-gray-700">
        <div className="max-md:hidden">
          <h3 className="text-xl font-bold mb-4">ConTracker</h3>
          <p className="text-sm text-gray-400 ">
            ConTracker is a blockchain-powered public works transparency
            platform. Track tenders, verify milestones, and ensure funds reach
            the right hands.
          </p>
        </div>

        <div>
          <h4 className="md:text-lg text-md font-semibold md:mb-4">Quick Links</h4>
          <ul className="md:space-y-2 text-sm text-gray-300 max-md:flex max-md:gap-2">
            <li>
              <a href="/" className="hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="/about-us" className="hover:text-white">
                About
              </a>
            </li>
            <li>
              <a href="/services" className="hover:text-white">
                Services
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="md:text-lg text-md font-semibold md:mb-4">Connect With Us</h4>
          {/* <p className="text-sm text-gray-400 mb-2">
            Email: support@contracker.gov
          </p> */}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="write your message"
              className="bg-none border-1 p-1 rounded-xl"
            />
            <IoIosSend size={25} />
          </div>
          <div className="flex space-x-4 mt-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaLinkedin size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaTwitter size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="md:mt-10 mt-5 md:mx-5 mx-2 border-t border-gray-700 md:pt-6 pt-3 text-center text-sm text-gray-500">
        <p className="md:text-lg text-md">
          Made With ❤️ By{" "}
          <span className="text-teal-400 font-semibold">Team Vibhav</span>
        </p>
      </div>
    </footer>
  );
}
