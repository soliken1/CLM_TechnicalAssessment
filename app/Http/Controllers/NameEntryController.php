<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NameEntry;

class NameEntryController extends Controller
{
    // Get all entries
    public function index() {
        return NameEntry::all();
    }

    // Create a new entry
    public function store(Request $request) {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
        ]);
        return NameEntry::create($validated);
    }

    // Update an existing entry
    public function update(Request $request, $id) {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
        ]);

        $entry = NameEntry::findOrFail($id);
        $entry->update($validated);

        return response()->json(['message' => 'Entry updated successfully', 'entry' => $entry], 200);
    }

    // Delete an entry
    public function destroy($id) {
        $entry = NameEntry::findOrFail($id);
        $entry->delete();

        return response()->json(['message' => 'Entry deleted successfully'], 200);
    }
}
