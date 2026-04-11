import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets.js";

const Sidebar = ({ isOpen = false, setIsOpen, setToken }) => {
    const navItems = [
        { to: "/", icon: assets.order_icon, text: "List Items" },
        { to: "/orders", icon: assets.parcel_icon, text: "Orders" },
        { to: "/add", icon: assets.add_icon, text: "Add Items" },
        { to: "/edit", icon: assets.add_icon, text: "Edit Items" },
        { to: "/shipping", icon: assets.order_icon, text: "Edit Shipping" },

    ];

    return (
        <>

                <button
                    className="fixed top-4 left-5 z-40 lg:hidden w-10 bg-white shadow-md p-2 rounded-md"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    ☰
                </button>

            {/* زر الموبايل ☰ */}



            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/40 z-20 lg:hidden transition-opacity duration-300 ${
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 z-30 h-full w-64 bg-white border-r border-gray-200
          flex flex-col p-6
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
        `}
            >
                {/* Logo */}
                <div className="mb-8 flex items-center justify-center lg:justify-start">
                    <img src={assets.logo} alt="Logo" className="w-28" />
                </div>

                {/* Nav */}
                <nav className="flex flex-col gap-2 flex-1">
                    {navItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.to}
                            end={item.to === "/"}
                            onClick={() => setIsOpen(false)} // يقفل في الموبايل بعد الاختيار
                            className={({ isActive }) =>
                                `
                flex items-center gap-3 px-4 py-3 rounded-lg transition
                border-l-4
                ${
                                    isActive
                                        ? "bg-blue-50 text-blue-700 border-blue-800 font-semibold"
                                        : "text-gray-600 border-transparent hover:bg-gray-100"
                                }
              `
                            }
                        >
                            <img src={item.icon} alt="" className="w-5 h-5" />
                            <span className="text-sm">{item.text}</span>
                        </NavLink>
                    ))}

                    {/* Logout */}
                    <button
                        onClick={() => setToken("")}
                        className="mt-40 bg-red-500 text-white hover:bg-red-600 px-4 py-3 rounded-lg text-sm"
                    >
                        Logout
                    </button>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;