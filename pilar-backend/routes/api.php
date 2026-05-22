<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TeamMemberController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\RealizationController;
use App\Http\Controllers\Api\DevisController;
use App\Http\Controllers\Api\ContactController;
use Illuminate\Support\Facades\Route;

// ── PUBLIC ROUTES ─────────────────────────────────────────────────────────────
Route::get('/team',         [TeamMemberController::class,  'index']);
Route::get('/services',     [ServiceController::class,     'index']);
Route::get('/realizations', [RealizationController::class, 'index']);
Route::post('/devis',       [DevisController::class,       'store']);
Route::post('/contact',     [ContactController::class,     'store']);

// ── AUTH ──────────────────────────────────────────────────────────────────────
Route::post('/admin/login',  [AuthController::class, 'login']);

// ── ADMIN PROTECTED ROUTES ────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    Route::apiResource('team',         TeamMemberController::class)
         ->except(['index']);
    Route::apiResource('services',     ServiceController::class)
         ->except(['index']);
    Route::apiResource('realizations', RealizationController::class)
         ->except(['index']);
    Route::apiResource('devis',        DevisController::class)
         ->except(['store']);
    Route::apiResource('contacts',     ContactController::class)
         ->except(['store', 'index']);
    Route::get('/devis',    [DevisController::class,   'index']);
    Route::get('/contacts', [ContactController::class, 'index']);
});
