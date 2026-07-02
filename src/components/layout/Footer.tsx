import { Building } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-footer text-gray-500 mt-16">
      <div className="max-w-[1440px] mx-auto px-10 py-12 grid grid-cols-4 gap-10">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-pink-600 rounded-xl flex items-center justify-center">
              <Building size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold font-['Poppins'] text-white">
              Nestify
            </span>
          </Link>
          <p className="text-xs leading-relaxed text-gray-500">
            India's most trusted real estate platform. Find your perfect home
            with verified listings and zero brokerage.
          </p>
        </div>
        {[
          {
            heading: "Explore",
            links: ["Buy Property", "Rent Property", "PG / Hostel", "Commercial", "New Projects"],
          },
          {
            heading: "Company",
            links: ["About Us", "Careers", "Blog", "Press", "Contact"],
          },
          {
            heading: "Support",
            links: ["Help Center", "Post Property", "Advertise", "Privacy Policy", "Terms"],
          },
        ].map((col) => (
          <div key={col.heading}>
            <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-4">
              {col.heading}
            </p>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-xs text-gray-500 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-300">
        <div className="max-w-[1440px] mx-auto px-10 py-6 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            © 2026 Nestify. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-500">Terms</a>
            <a href="#" className="hover:text-gray-500">Privacy</a>
            <a href="#" className="hover:text-gray-500">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
