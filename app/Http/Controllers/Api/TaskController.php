<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::with('category')
            ->where('user_id', auth()->id());

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by priority
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        // Filter by category
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Search by title or description
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Paginate
        $perPage = $request->get('per_page', 9);
        $tasks = $query->paginate($perPage);

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:pending,in_progress,completed',
            'priority' => 'nullable|in:low,medium,high',
            'due_date' => 'nullable|date',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $task = Task::create([
            'user_id' => auth()->id(),
            'category_id' => $request->category_id,
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status ?? 'pending',
            'priority' => $request->priority ?? 'medium',
            'due_date' => $request->due_date,
        ]);

        return response()->json($task->load('category'), 201);
    }

    public function show($id)
    {
        $task = Task::with('category')
            ->where('user_id', auth()->id())
            ->findOrFail($id);

        return response()->json($task);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:pending,in_progress,completed',
            'priority' => 'nullable|in:low,medium,high',
            'due_date' => 'nullable|date',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $task = Task::where('user_id', auth()->id())->findOrFail($id);

        $data = [
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status ?? $task->status,
            'priority' => $request->priority ?? $task->priority,
            'due_date' => $request->due_date,
            'category_id' => $request->category_id,
        ];

        // Set completed_at when status changes to completed
        if ($request->status === 'completed' && $task->status !== 'completed') {
            $data['completed_at'] = now();
        } elseif ($request->status !== 'completed') {
            $data['completed_at'] = null;
        }

        $task->update($data);

        return response()->json($task->load('category'), 200);
    }

    public function destroy($id)
    {
        $task = Task::where('user_id', auth()->id())->findOrFail($id);
        $task->delete();

        return response()->json(['message' => 'Task deleted successfully'], 200);
    }

    // Toggle task status (quick action)
    public function toggleStatus($id)
    {
        $task = Task::where('user_id', auth()->id())->findOrFail($id);

        $newStatus = $task->status === 'completed' ? 'pending' : 'completed';

        $task->update([
            'status' => $newStatus,
            'completed_at' => $newStatus === 'completed' ? now() : null,
        ]);

        return response()->json($task->load('category'), 200);
    }

    // Dashboard statistics
    public function stats()
    {
        $userId = auth()->id();

        return response()->json([
            'total' => Task::where('user_id', $userId)->count(),
            'pending' => Task::where('user_id', $userId)->where('status', 'pending')->count(),
            'in_progress' => Task::where('user_id', $userId)->where('status', 'in_progress')->count(),
            'completed' => Task::where('user_id', $userId)->where('status', 'completed')->count(),
            'overdue' => Task::where('user_id', $userId)
                ->where('due_date', '<', now())
                ->where('status', '!=', 'completed')
                ->count(),
        ]);
    }
}