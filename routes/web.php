<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Tasks Pages (Inertia)
    Route::get('/tasks', function () {
        return Inertia::render('Tasks/Index');
    })->name('tasks.index');

    Route::get('/tasks/create', function () {
        return Inertia::render('Tasks/Create');
    })->name('tasks.create');

    Route::get('/tasks/{id}/edit', function ($id) {
        return Inertia::render('Tasks/Edit', ['taskId' => $id]);
    })->name('tasks.edit');

    // Categories Page (Inertia)
    Route::get('/categories', function () {
        return Inertia::render('Categories/Index');
    })->name('categories.index');

    // ============================================
    // API Routes (مدمجة داخل web.php لتعمل مع session)
    // ============================================
    Route::prefix('api')->group(function () {
        // Categories
        Route::get('/categories', [CategoryController::class, 'index']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        // Tasks
        Route::get('/tasks', [TaskController::class, 'index']);
        Route::post('/tasks', [TaskController::class, 'store']);
        Route::get('/tasks/{id}', [TaskController::class, 'show']);
        Route::put('/tasks/{id}', [TaskController::class, 'update']);
        Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
        Route::patch('/tasks/{id}/toggle-status', [TaskController::class, 'toggleStatus']);

        // Stats
        Route::get('/stats', [TaskController::class, 'stats']);
    });
});

require __DIR__.'/auth.php';