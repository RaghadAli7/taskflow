import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import toast from 'react-hot-toast';

export default function Create() {
    const [form, setForm] = useState({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        due_date: '',
        category_id: '',
    });
    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        axios.get('/api/categories').then((res) => setCategories(res.data));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        await axios.post('/api/tasks', form);
        toast.success('Task created successfully! 🎉');
        setTimeout(() => {
            window.location.href = '/tasks';
        }, 500);
    } catch (error) {
        console.error(error.response?.data);
        const message = error.response?.data?.message || 'Failed to create task';
        toast.error(message);
    } finally {
        setIsSubmitting(false);
    }
};
    return (
        <AuthenticatedLayout>
            <Head title="Create Task" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl px-4">
                    <Link
                        href="/tasks"
                        className="mb-6 inline-block text-slate-800 hover:text-amber-500 transition"
                    >
                        ← Back to Tasks
                    </Link>

                    <div className="rounded-xl bg-white p-8 shadow-lg border-t-4 border-amber-500">
                        <h1 className="mb-8 text-3xl font-bold text-slate-800">
                            Create New Task
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
                                    {isSubmitting ? 'Creating...' : 'Create Task'}
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