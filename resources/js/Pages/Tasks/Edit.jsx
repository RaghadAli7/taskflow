import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit() {
    const { taskId } = usePage().props;
    const [form, setForm] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            axios.get(`/api/tasks/${taskId}`),
            axios.get('/api/categories'),
        ]).then(([taskRes, catRes]) => {
            const task = taskRes.data;
            setForm({
                title: task.title,
                description: task.description || '',
                status: task.status,
                priority: task.priority,
                due_date: task.due_date ? task.due_date.split('T')[0] : '',
                category_id: task.category_id || '',
            });
            setCategories(catRes.data);
            setLoading(false);
        });
    }, [taskId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.put(`/api/tasks/${taskId}`, form);
            window.location.href = '/tasks';
        } catch (error) {
            console.error(error);
            alert('An error occurred while updating the task');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <AuthenticatedLayout>
                <Head title="Edit Task" />
                <div className="flex min-h-[60vh] items-center justify-center">
                    <p className="text-gray-500">Loading...</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Edit Task" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl px-4">
                    <Link
                        href="/tasks"
                        className="mb-6 inline-block text-slate-800 hover:text-amber-500 transition"
                    >
                        ← Back to Tasks
                    </Link>

                    <div className="rounded-xl bg-white p-8 shadow-lg border-t-4 border-slate-800">
                        <h1 className="mb-8 text-3xl font-bold text-slate-800">
                            Edit Task
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    rows="4"
                                    value={form.description}
                                    onChange={handleChange}
                                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-500"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Priority
                                    </label>
                                    <select
                                        name="priority"
                                        value={form.priority}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-500"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        name="due_date"
                                        value={form.due_date}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Category
                                    </label>
                                    <select
                                        name="category_id"
                                        value={form.category_id}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-500"
                                    >
                                        <option value="">No Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 rounded-lg bg-amber-500 px-6 py-3 font-bold text-slate-900 hover:bg-amber-400 disabled:opacity-50 transition"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                                <Link
                                    href="/tasks"
                                    className="flex-1 rounded-lg bg-slate-800 px-6 py-3 text-center font-medium text-white hover:bg-slate-700 transition"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}