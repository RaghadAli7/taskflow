<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(
            Category::where('user_id', auth()->id())->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:7',
        ]);

        $category = Category::create([
            'user_id' => auth()->id(),
            'name' => $request->name,
            'color' => $request->color ?? '#3B82F6',
        ]);

        return response()->json($category, 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:7',
        ]);

        $category = Category::where('user_id', auth()->id())->findOrFail($id);
        $category->update([
            'name' => $request->name,
            'color' => $request->color ?? $category->color,
        ]);

        return response()->json($category, 200);
    }

    public function destroy($id)
    {
        $category = Category::where('user_id', auth()->id())->findOrFail($id);
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully'], 200);
    }
}