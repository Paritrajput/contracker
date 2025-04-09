// components/Footer.jsx
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10 px-3">
      <div className="mx-5  grid grid-cols-1 md:grid-cols-3 gap-8 border-t p-5 border-gray-700">
        <div>
          <h3 className="text-xl font-bold mb-4">ConTracker</h3>
          <p className="text-sm text-gray-400">
            ConTracker is a blockchain-powered public works transparency
            platform. Track tenders, verify milestones, and ensure funds reach
            the right hands.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-300">
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
          <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
          <p className="text-sm text-gray-400 mb-2">
            Email: support@contracker.gov
          </p>
          <div className="flex gap-2 items-center">
          <input type="text" placeholder="write your message" className="bg-none border-1 p-1 rounded-xl" />
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

      <div className="mt-10 mx-5 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        <p className="text-lg">
          Made With ❤️ By{" "}
          <span className="text-teal-400 font-semibold">Team Vibhav</span>
        </p>
      </div>
    </footer>
  );
}
