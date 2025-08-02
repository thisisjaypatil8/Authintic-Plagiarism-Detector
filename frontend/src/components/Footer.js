import React from "react";

const Footer = () => {
    return (
        <footer className="w-full bg-white border-t border-gray-200 mt-auto">
            <div className="container mx-auto py-4 text-center">
                <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} Plagiarism Checker. All Rights Reserved.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    Developed by Prathamesh, Harsh, Viraj, and Jay.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
