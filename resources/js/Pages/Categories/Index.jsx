import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', color: '#3B82F6' });

    const fetchCategories = () => {
        setLoading(true);
        axios.get('/api/categories').then((res) => {
            setCategories(res.data);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await axios.put(`/api/categories/${editing}`, form);
            } else {
                await axios.post('/api/categories', form);
            }
            setForm({ name: '', color: '#3B82F6' });
            setEditing(null);
            setShowForm(false);
            fetchCategories();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (cat) => {
        setForm({ name: cat.name, color: cat.color });
        setEditing(cat.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this category?')) {
            await axios.delete(`/api/categories/${id}`);
            fetchCategories();
        }
    };

    const colors = [
        '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
        '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Categories" />

            <div className="py-6">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Categories</h1>
                            <p className="text-gray-600">Organize your tasks with categories</p>
                        </div>
                        <button
                            onClick={() => {
                                setShowForm(!showForm);
                                setEditing(null);
                                setForm({ name: '', color: '#3B82F6' });
                            }}
                            className="rounded-lg bg-amber-500 px-5 py-2.5 font-medium text-slate-900 hover:bg-amber-400 transition"
                        >
                            {showForm ? 'Cancel' : '+ Add Category'}
                        </button>
                    </div>

                    {showForm && (
                        <form
                            onSubmit={handleSubmit}
                            className="mb-6 rounded-xl bg-white p-6 shadow-md border-t-4 border-amber-500"
                        >
                            <h3 className="mb-4 text-lg font-bold text-slate-800">
                                {editing ? 'Edit Category' : 'New Category'}
                            </h3>
                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-amber-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Color
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setForm({ ...form, color })}
                                            className={`h-10 w-10 rounded-full transition ${
                                                form.color === color
                                                    ? 'ring-4 ring-slate-800 ring-offset-2'
                                                    : 'hover:scale-110'
                                            }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="rounded-lg bg-slate-800 px-6 py-2 text-white hover:bg-slate-700 transition"
                            >
                                {editing ? 'Update' : 'Create'}
                            </button>
                        </form>
                    )}

                    {loading ? (
                        <div className="py-12 text-center text-gray-500">Loading...</div>
                    ) : categories.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="flex items-center justify-between rounded-xl bg-white p-4 shadow-md border-l-4"
                                    style={{ borderColor: cat.color }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-10 w-10 rounded-full"
                                            style={{ backgroundColor: cat.color }}
                                        />
                                        <span className="font-bold text-slate-800">
                                            {cat.name}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(cat)}
                                            className="rounded-lg bg-slate-800 px-3 py-1 text-sm text-white hover:bg-slate-700 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl bg-white p-12 text-center shadow-md">
                            <p className="mb-4 text-6xl">📁</p>
                            <p className="text-gray-600">No categories yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}