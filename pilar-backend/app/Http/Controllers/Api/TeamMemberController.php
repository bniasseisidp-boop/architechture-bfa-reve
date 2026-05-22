<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\Request;

class TeamMemberController extends Controller
{
    public function index()
    {
        return response()->json(
            TeamMember::orderBy('is_founder', 'desc')->orderBy('sort_order')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'role'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'photo'       => 'nullable|image|max:4096',
            'is_founder'  => 'boolean',
            'sort_order'  => 'integer',
        ]);

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('team', 'public');
        }

        $member = TeamMember::create($data);
        return response()->json($member, 201);
    }

    public function show(TeamMember $teamMember)
    {
        return response()->json($teamMember);
    }

    public function update(Request $request, TeamMember $teamMember)
    {
        $data = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'role'        => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'photo'       => 'nullable|image|max:4096',
            'is_founder'  => 'boolean',
            'sort_order'  => 'integer',
        ]);

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('team', 'public');
        }

        $teamMember->update($data);
        return response()->json($teamMember->fresh());
    }

    public function destroy(TeamMember $teamMember)
    {
        $teamMember->delete();
        return response()->json(['message' => 'Membre supprimé.']);
    }
}
