import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import toast from 'react-hot-toast';

export default function Index() {
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);

    // Filters
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');
    const [page, setPage] = useState(1);

    const fetchTasks = () => {
        setLoading(true);
        axios
            .get('/api/tasks', {
                params: {
                    search,
                    status,
                    priority,
                    category_id: categoryId,
                    sort_by: sortBy,
                    sort_order: sortOrder,
                    page,
                },
            })
            .then((response) => {
                setTasks(response.data.data);
                setPagination(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    };

    useEffect(() => {
        axios.get('/api/categories').then((res) => setCategories(res.data));
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [search, status, priority, categoryId, sortBy, sortOrder, page]);

    const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this task?')) {
        try {
            await axios.delete(`/api/tasks/${id}`);
            toast.success('Task deleted successfully');
            fetchTasks();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete task');
        }
    }
};

    const handleToggleStatus = async (id) => {
    try {
        const response = await axios.patch(`/api/tasks/${id}/toggle-status`);
        if (response.data.status === 'completed') {
            toast.success('Task marked as completed 🎉');
        } else {
            toast.success('Task marked as pending');
        }
        fetchTasks();
    } catch (error) {
        console.error(error);
        toast.error('Failed to update task');
    }
};

    const getStatusStyle = (status) => {
        const styles = {
            pending: 'bg-amber-100 text-amber-800 border-amber-300',
            in_progress: 'bg-orange-100 text-orange-800 border-orange-300',
            completed: 'bg-green-100 text-green-800 border-green-300',
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status) => {
        const texts = {
            pending: 'Pending',
            in_progress: 'In Progress',
            completed: 'Completed',
        };
        return texts[status] || status;
    };

    const getPriorityStyle = (priority) => {
        const styles = {
            low: 'bg-slate-100 text-slate-700',
            medium: 'bg-amber-100 text-amber-700',
            high: 'bg-red-100 text-red-700',
        };
        return styles[priority] || 'bg-gray-100 text-gray-700';
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tasks" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Tasks</h1>
                            <p className="text-gray-600">Manage your daily tasks</p>
                        </div>
                        <button
                            onClick={() => (window.location.href = '/tasks/create')}
                            className="rounded-lg bg-amber-500 px-5 py-2.5 font-medium text-slate-900 hover:bg-amber-400 transition"
                        >
                            + Add New Task
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 rounded-xl bg-white p-4 shadow-md">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                            />
                            <select
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    setPage(1);
                                }}
                                className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-amber-500"
                            >
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                            <select
                                value={priority}
                                onChange={(e) => {
                                    setPriority(e.target.value);
                                    setPage(1);
                                }}
                                className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-amber-500"
                            >
                                <option value="">All Priorities</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                            <select
                                value={categoryId}
                                onChange={(e) => {
                                    setCategoryId(e.target.value);
                                    setPage(1);
                                }}
                                className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-amber-500"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => {
                                    const [by, order] = e.target.value.split('-');
                                    setSortBy(by);
                                    setSortOrder(order);
                                }}
                                className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-amber-500"
                            >
                                <option value="created_at-desc">Newest First</option>
                                <option value="created_at-asc">Oldest First</option>
                                <option value="due_date-asc">Due Date (Soon)</option>
                                <option value="priority-desc">Priority (High)</option>
                            </select>
                        </div>
                    </div>

                    {/* Tasks List */}
                    {loading ? (
                        <div className="py-12 text-center text-gray-500">Loading...</div>
                    ) : tasks.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className={`rounded-xl bg-white p-5 shadow-md border-l-4 transition hover:shadow-lg ${
                                            task.status === 'completed'
                                                ? 'border-green-500 opacity-75'
                                                : task.priority === 'high'
                                                ? 'border-red-500'
                                                : task.priority === 'medium'
                                                ? 'border-amber-500'
                                                : 'border-slate-300'
                                        }`}
                                    >
                                        <div className="mb-3 flex items-start justify-between">
                                            <h3
                                                className={`text-lg font-bold ${
                                                    task.status === 'completed'
                                                        ? 'text-gray-400 line-through'
                                                        : 'text-slate-800'
                                                }`}
                                            >
                                                {task.title}
                                            </h3>
                                            <button
                                                onClick={() => handleToggleStatus(task.id)}
                                                className="text-2xl transition hover:scale-110"
                                                title="Toggle status"
                                            >
                                                {task.status === 'completed' ? '✅' : '⬜'}
                                            </button>
                                        </div>

                                        {task.description && (
                                            <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                                                {task.description}
                                            </p>
                                        )}

                                        <div className="mb-3 flex flex-wrap gap-2">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium border ${getStatusStyle(
                                                    task.status
                                                )}`}
                                            >
                                                {getStatusText(task.status)}
                                            </span>
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityStyle(
                                                    task.priority
                                                )}`}
                                            >
                                                {task.priority.toUpperCase()}
                                            </span>
                                            {task.category && (
                                                <span
                                                    className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                                                    style={{ backgroundColor: task.category.color }}
                                                >
                                                    {task.category.name}
                                                </span>
                                            )}
                                        </div>

                                        {task.due_date && (
                                            <p
                                                className={`mb-3 text-xs ${
                                                    task.status !== 'completed' &&
                                                    new Date(task.due_date) < new Date()
                                                        ? 'text-red-600 font-bold'
                                                        : 'text-gray-500'
                                                }`}
                                            >
                                                📅 Due: {new Date(task.due_date).toLocaleDateString('en-US')}
                                            </p>
                                        )}

                                        <div className="mt-auto flex gap-2 pt-3 border-t border-gray-100">
                                            <button
                                                onClick={() =>
                                                    (window.location.href = `/tasks/${task.id}/edit`)
                                                }
                                                className="flex-1 rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-white hover:bg-slate-700 transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(task.id)}
                                                className="flex-1 rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.last_page > 1 && (
                                <div className="mt-8 flex justify-center gap-2">
                                    <button
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                        className="rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        ← Previous
                                    </button>
                                    <span className="rounded-lg bg-white px-4 py-2 shadow">
                                        Page {pagination.current_page} of {pagination.last_page}
                                    </span>
                                    <button
                                        onClick={() => setPage(page + 1)}
                                        disabled={page === pagination.last_page}
                                        className="rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="rounded-xl bg-white p-12 text-center shadow-md">
                            <p className="mb-4 text-6xl">📝</p>
                            <p className="mb-4 text-lg text-gray-600">No tasks found.</p>
                            <button
                                onClick={() => (window.location.href = '/tasks/create')}
                                className="rounded-lg bg-amber-500 px-6 py-2.5 font-medium text-slate-900 hover:bg-amber-400 transition"
                            >
                                Create Your First Task
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}