import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome({ auth }) {
    const isLoggedIn = auth?.user;

    return (
        <>
            <Head title="TaskFlow - Task Manager" />

            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
                {/* Header */}
                <header className="bg-slate-800 shadow-lg">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-3xl">✅</span>
                                <h1 className="text-2xl font-bold text-amber-500">TaskFlow</h1>
                            </div>
                            <div className="flex items-center gap-4">
                                {isLoggedIn ? (
                                    <Link
                                        href="/dashboard"
                                        className="rounded-lg bg-amber-500 px-4 py-2 font-medium text-slate-900 hover:bg-amber-400 transition"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/login" className="text-gray-300 hover:text-amber-500 transition">
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="rounded-lg bg-amber-500 px-4 py-2 font-medium text-slate-900 hover:bg-amber-400 transition"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="py-24">
                    <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                        <h2 className="mb-6 text-4xl font-bold text-white lg:text-6xl">
                            Organize Your Tasks.
                            <br />
                            <span className="text-amber-500">Achieve More.</span>
                        </h2>
                        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-300">
                            TaskFlow is a modern task management application that helps you
                            organize your daily tasks, set priorities, and track your progress
                            efficiently.
                        </p>
                        <div className="flex justify-center gap-4">
                            {isLoggedIn ? (
                                <Link
                                    href="/dashboard"
                                    className="rounded-lg bg-amber-500 px-8 py-4 font-bold text-slate-900 hover:bg-amber-400 transition"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/register"
                                        className="rounded-lg bg-amber-500 px-8 py-4 font-bold text-slate-900 hover:bg-amber-400 transition"
                                    >
                                        Get Started Free
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="rounded-lg border-2 border-amber-500 px-8 py-4 font-bold text-amber-500 hover:bg-amber-500 hover:text-slate-900 transition"
                                    >
                                        Login
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-slate-900 py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <h3 className="mb-4 text-3xl font-bold text-white">
                                Everything You Need
                            </h3>
                            <p className="text-lg text-gray-400">
                                Features designed to boost your productivity
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="rounded-xl bg-slate-800 p-8 border-t-4 border-amber-500 transition hover:bg-slate-700">
                                <div className="mb-4 text-5xl">📝</div>
                                <h4 className="mb-3 text-xl font-bold text-white">
                                    Task Management
                                </h4>
                                <p className="text-gray-400">
                                    Create, edit, and organize your tasks with ease
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-800 p-8 border-t-4 border-orange-500 transition hover:bg-slate-700">
                                <div className="mb-4 text-5xl">🎯</div>
                                <h4 className="mb-3 text-xl font-bold text-white">
                                    Priority Levels
                                </h4>
                                <p className="text-gray-400">
                                    Set priorities to focus on what matters most
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-800 p-8 border-t-4 border-green-500 transition hover:bg-slate-700">
                                <div className="mb-4 text-5xl">📊</div>
                                <h4 className="mb-3 text-xl font-bold text-white">
                                    Progress Tracking
                                </h4>
                                <p className="text-gray-400">
                                    Track your progress with detailed statistics
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20">
                    <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                        <h3 className="mb-6 text-3xl font-bold text-white">
                            Ready to Get Organized?
                        </h3>
                        <p className="mb-8 text-lg text-gray-300">
                            Join TaskFlow today and start managing your tasks efficiently
                        </p>
                        {!isLoggedIn && (
                            <Link
                                href="/register"
                                className="inline-block rounded-lg bg-amber-500 px-8 py-4 text-lg font-bold text-slate-900 hover:bg-amber-400 transition"
                            >
                                Sign Up Now
                            </Link>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 py-8 text-center text-gray-400">
                    <p>© 2026 TaskFlow - All Rights Reserved</p>
                </footer>
            </div>
        </>
    );
}