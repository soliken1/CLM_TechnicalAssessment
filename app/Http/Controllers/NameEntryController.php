<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NameEntry;

class NameEntryController extends Controller
{
    public function index() {
        return NameEntry::all();
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
        ]);
        return NameEntry::create($validated);
    }
}
