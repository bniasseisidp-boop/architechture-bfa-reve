<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Realization;
use Illuminate\Http\Request;

class RealizationController extends Controller
{
    public function index()
    {
        return response()->json(Realization::orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'category'    => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|max:8192',
            'year'        => 'nullable|string|max:10',
            'sort_order'  => 'integer',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('realizations', 'public');
        }

        $real = Realization::create($data);
        return response()->json($real, 201);
    }

    public function show(Realization $realization)
    {
        return response()->json($realization);
    }

    public function update(Request $request, Realization $realization)
    {
        $data = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'category'    => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|max:8192',
            'year'        => 'nullable|string|max:10',
            'sort_order'  => 'integer',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('realizations', 'public');
        }

        $realization->update($data);
        return response()->json($realization->fresh());
    }

    public function destroy(Realization $realization)
    {
        $realization->delete();
        return response()->json(['message' => 'Réalisation supprimée.']);
    }
}
