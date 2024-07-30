import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const Navbar = ({ isHead, isRm, isAgent }) => {
    const [cookies, setCookie, removeCookie] = useCookies([
        'accessToken',
        'refreshToken',
    ]);
    const navigate = useNavigate();

    const handleLogout = () => {
        removeCookie('accessToken', { path: '/' });
        removeCookie('refreshToken', { path: '/' });
        if (isHead) {
            navigate('/login/head');
        } else if (isRm) {
            navigate('/login/rm');
        } else if (isAgent) {
            navigate('/login/agent');
        } else {
            navigate('/login/agent');
        }
    };

    const renderTabs = () => {
        if (isHead) {
            return (
                <>
                    <NavLink
                        to="/head/home"
                        className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/head/rms"
                        className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        RM
                    </NavLink>
                    <NavLink
                        to="/head/agents"
                        className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Agents
                    </NavLink>
                    <NavLink
                        to="/head/customers"
                        className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Customers
                    </NavLink>
                    <NavLink
                        to="/head/policies"
                        className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Policies
                    </NavLink>
                    <NavLink
                        to="/head/profile"
                        className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Profile
                    </NavLink>
                </>
            );
        } else if (isRm) {
            return (
                <>
                    <NavLink
                        to="/rm/home"
                        className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/rm/agents"
                        className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Agents
                    </NavLink>
                    <NavLink
                        to="/rm/customers"
                        className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Customers
                    </NavLink>
                    <NavLink
                        to="/rm/policies"
                        className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Policies
                    </NavLink>
                    <NavLink
                        to="/rm/profile"
                        className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Profile
                    </NavLink>
                </>
            );
        } else {
            return (
                <>
                    <NavLink
                        to="/agent/home"
                        className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/agent/customers"
                        className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Customers
                    </NavLink>
                    <NavLink
                        to="/agent/policies"
                        className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Policies
                    </NavLink>
                    <NavLink
                        to="/agent/profile"
                        className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Profile
                    </NavLink>
                </>
            );
        }
    };

    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <img
                            className="h-8 w-auto"
                            src="/logo.svg"
                            alt="Logo"
                        />
                    </div>
                    <nav className="ml-auto flex items-center space-x-4">
                        <div className="flex space-x-4">{renderTabs()}</div>
                        <button
                            onClick={handleLogout}
                            className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                        >
                            Logout
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
