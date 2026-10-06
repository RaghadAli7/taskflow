import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const logout = () => {
        if (confirm('Are you sure you want to log out?')) {
            router.post('/logout');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-slate-800 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/dashboard" className="text-xl font-bold text-amber-500">
                                ✅ TaskFlow
                            </Link>
                        </div>

                        <div className="flex items-center space-x-1">
                            <Link href="/dashboard" className="text-gray-300 hover:text-amber-500 hover:bg-slate-700 px-4 py-2 rounded-lg transition">
                                Dashboard
                            </Link>
                            <Link href="/tasks" className="text-gray-300 hover:text-amber-500 hover:bg-slate-700 px-4 py-2 rounded-lg transition">
                                Tasks
                            </Link>
                            <Link href="/categories" className="text-gray-300 hover:text-amber-500 hover:bg-slate-700 px-4 py-2 rounded-lg transition">
                                Categories
                            </Link>

                            <div className="border-r border-slate-600 h-8 mx-2"></div>

                            <span className="text-sm text-gray-300 px-2">
                                {user?.name}
                            </span>

                            <button
                                onClick={logout}
                                className="bg-amber-500 text-slate-900 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-amber-400 transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main>{children}</main>
        </div>
    );
}