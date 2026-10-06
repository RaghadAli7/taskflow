import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/stats')
            .then((response) => {
                setStats(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <AuthenticatedLayout>
                <Head title="Dashboard" />
                <div className="flex min-h-[60vh] items-center justify-center">
                    <p className="text-gray-500">Loading...</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    const cards = [
        { title: 'Total Tasks', value: stats?.total || 0, color: 'slate', icon: '📋' },
        { title: 'Pending', value: stats?.pending || 0, color: 'amber', icon: '⏳' },
        { title: 'In Progress', value: stats?.in_progress || 0, color: 'orange', icon: '🔄' },
        { title: 'Completed', value: stats?.completed || 0, color: 'green', icon: '✅' },
        { title: 'Overdue', value: stats?.overdue || 0, color: 'red', icon: '⚠️' },
    ];

    const getColorClasses = (color) => {
        const colors = {
            slate: { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-800' },
            amber: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-500' },
            orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-500' },
            green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-500' },
            red: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-500' },
        };
        return colors[color] || colors.slate;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
                        <p className="text-gray-600">Overview of your tasks</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
                        {cards.map((card, index) => {
                            const colors = getColorClasses(card.color);
                            return (
                                <div
                                    key={index}
                                    className={`rounded-xl bg-white p-6 shadow-md border-l-4 ${colors.border} transition hover:shadow-lg`}
                                >
                                    <div className="mb-2 text-3xl">{card.icon}</div>
                                    <div className={`mb-1 text-3xl font-bold ${colors.text}`}>
                                        {card.value}
                                    </div>
                                    <div className="text-sm text-gray-600">{card.title}</div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 flex gap-4">
                        <Link
                            href="/tasks/create"
                            className="rounded-lg bg-amber-500 px-6 py-3 font-medium text-slate-900 hover:bg-amber-400 transition"
                        >
                            + Add New Task
                        </Link>
                        <Link
                            href="/tasks"
                            className="rounded-lg bg-slate-800 px-6 py-3 font-medium text-white hover:bg-slate-700 transition"
                        >
                            View All Tasks
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}