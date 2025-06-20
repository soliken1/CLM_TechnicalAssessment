<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NameEntryController;

Route::get('/entries', [NameEntryController::class, 'index']);
Route::post('/entries', [NameEntryController::class, 'store']);
Route::put('/entries/{id}', [NameEntryController::class, 'update']);
Route::delete('/entries/{id}', [NameEntryController::class, 'destroy']);