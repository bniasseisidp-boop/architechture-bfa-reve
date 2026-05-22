<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Devis;
use Illuminate\Http\Request;

class DevisController extends Controller
{
    /** Public: submit a devis request */
    public function store(Request $request)
    {
        $data = $request->validate([
            'full_name'    => 'required|string|max:255',
            'email'        => 'required|email',
            'phone'        => 'required|string|max:30',
            'project_type' => 'nullable|string|max:100',
            'budget'       => 'nullable|string|max:100',
            'message'      => 'required|string',
        ]);

        $devis = Devis::create($data);
        return response()->json(['message' => 'Votre demande de devis a été envoyée.', 'id' => $devis->id], 201);
    }

    /** Admin: list all devis */
    public function index()
    {
        return response()->json(Devis::latest()->get());
    }

    /** Admin: show one */
    public function show(Devis $devis)
    {
        if ($devis->status === 'pending') {
            $devis->update(['status' => 'read']);
        }
        return response()->json($devis);
    }

    /** Admin: reply / update status */
    public function update(Request $request, Devis $devis)
    {
        $data = $request->validate([
            'status'      => 'sometimes|in:pending,read,replied,archived',
            'admin_reply' => 'nullable|string',
        ]);

        if (!empty($data['admin_reply'])) {
            $data['status']      = 'replied';
            $data['replied_at']  = now();
        }

        $devis->update($data);
        return response()->json($devis->fresh());
    }

    public function destroy(Devis $devis)
    {
        $devis->delete();
        return response()->json(['message' => 'Devis supprimé.']);
    }
}
