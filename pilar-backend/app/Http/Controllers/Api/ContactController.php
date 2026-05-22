<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /** Public: send a contact message */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email',
            'phone'   => 'nullable|string|max:30',
            'message' => 'required|string',
        ]);

        Contact::create($data);
        return response()->json(['message' => 'Message envoyé avec succès.'], 201);
    }

    /** Admin: list all contacts */
    public function index()
    {
        return response()->json(Contact::latest()->get());
    }

    /** Admin: mark as read */
    public function update(Request $request, Contact $contact)
    {
        $contact->update(['is_read' => true]);
        return response()->json($contact->fresh());
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();
        return response()->json(['message' => 'Message supprimé.']);
    }

    public function show(Contact $contact)
    {
        $contact->update(['is_read' => true]);
        return response()->json($contact);
    }
}
