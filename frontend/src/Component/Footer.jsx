import { Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { footerSections } from "../Constant/footer.js";

export default function Footer() {
  return (
    <>
      <footer className="bg-purple-100 text-gray-700 py-10 mt-6">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {footerSections.map((footerLink, idx) => (
              <div key={idx}>
                <h2 className="text-lg font-semibold ">{footerLink.h}</h2>
                <ul className="mt-4 space-y-2">
                  {footerLink.l.map((listLink, idx) => (
                    <li key={idx}>
                      <Link to="#" className="hover:underline">
                        {listLink.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h2 className="text-lg font-semibold">CONNECT</h2>
              <div className="flex space-x-4 mt-4">
                <Link to="#" className="text-xl hover:text-gray-500">
                  <Instagram />
                </Link>
                <Link to="#" className="text-xl hover:text-gray-500">
                  <Facebook />
                </Link>
                <Link to="#" className="text-xl hover:text-gray-500">
                  <Youtube />
                </Link>
                <Link to="#" className="text-xl hover:text-gray-500">
                  <Twitter />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t pt-6 text-center text-sm text-gray-600">
            © 2025 WorkSpaceHub ® |
            <Link to="#" className="hover:underline">
              Terms & Privacy
            </Link>
            |
            <Link to="#" className="hover:underline">
              Privacy Snapshot
            </Link>
            |
            <Link to="#" className="hover:underline">
              Cookie Policy
            </Link>
            |
            <Link to="#" className="hover:underline">
              Accessibility Statement
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
