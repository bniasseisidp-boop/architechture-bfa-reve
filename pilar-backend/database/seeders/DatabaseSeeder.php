<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;
use App\Models\TeamMember;
use App\Models\Service;
use App\Models\Realization;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Admin account
        Admin::firstOrCreate(
            ['email' => 'moussasene@pilarconstruction.com'],
            ['name' => 'Baye Assane Niasse', 'password' => Hash::make('pilar@2024')]
        );

        // Team members
        if (TeamMember::count() === 0) {
            $members = [
                ['name' => 'Baye Assane Niasse', 'role' => 'Fondateur & PDG', 'is_founder' => true, 'sort_order' => 0,
                 'description' => 'Visionnaire passionné par l\'architecture et la construction durable, Baye Assane Niasse a fondé Pilar Construction avec la mission de transformer le paysage architectural de la région. Fort de plus de 15 ans d\'expérience dans le secteur du BTP, il guide l\'entreprise vers l\'excellence avec intégrité et détermination.'],
                ['name' => 'Aminata Diallo', 'role' => 'Architecte Principal', 'is_founder' => false, 'sort_order' => 1,
                 'description' => 'Architecte diplômée avec une spécialisation en conception durable, Aminata apporte créativité et rigueur technique exceptionnelles à chaque projet. Elle transforme les idées en plans maîtrisés.'],
                ['name' => 'Moussa Sarr', 'role' => 'Ingénieur Structural', 'is_founder' => false, 'sort_order' => 2,
                 'description' => 'Expert en génie civil, Moussa assure la solidité et la sécurité de toutes nos constructions avec une précision remarquable. Garant de la conformité aux normes les plus strictes.'],
                ['name' => 'Fatou Ndiaye', 'role' => 'Directrice Commerciale', 'is_founder' => false, 'sort_order' => 3,
                 'description' => 'Avec 10 ans d\'expérience dans le développement commercial, Fatou est le pont entre Pilar Construction et ses clients, assurant satisfaction et fidélisation.'],
            ];
            foreach ($members as $m) {
                TeamMember::create($m);
            }
        }

        // Services
        if (Service::count() === 0) {
            $services = [
                ['icon' => '🏗️', 'title' => 'Construction Résidentielle', 'sort_order' => 0,
                 'description' => 'Villas, maisons et appartements — nous construisons vos espaces de vie avec soin et expertise, en respectant vos aspirations et votre budget.'],
                ['icon' => '🏢', 'title' => 'Construction Commerciale', 'sort_order' => 1,
                 'description' => 'Bureaux, commerces, entrepôts — des espaces professionnels fonctionnels, esthétiques et adaptés à votre activité.'],
                ['icon' => '🔨', 'title' => 'Rénovation & Réhabilitation', 'sort_order' => 2,
                 'description' => 'Donnez une nouvelle vie à vos espaces avec nos services de rénovation complète. Nous transformons l\'existant en quelque chose d\'exceptionnel.'],
                ['icon' => '📐', 'title' => 'Architecture & Design', 'sort_order' => 3,
                 'description' => 'Conception architecturale innovante alliant esthétique moderne et fonctionnalité. Des plans sur mesure pour chaque projet.'],
                ['icon' => '📋', 'title' => 'Gestion de Projets', 'sort_order' => 4,
                 'description' => 'Suivi rigoureux de vos chantiers du début à la livraison. Respect des délais, des budgets et des normes de qualité.'],
                ['icon' => '🌿', 'title' => 'Construction Durable', 'sort_order' => 5,
                 'description' => 'Intégration des principes de construction écologique et durable dans tous nos projets. Bâtir aujourd\'hui pour demain.'],
            ];
            foreach ($services as $s) {
                Service::create($s);
            }
        }

        // Realizations
        if (Realization::count() === 0) {
            $reals = [
                ['title' => 'Villa Panorama', 'category' => 'Résidentiel', 'year' => '2024', 'sort_order' => 0,
                 'description' => 'Villa moderne avec vue panoramique — 450m², finitions haut de gamme, piscine intégrée.'],
                ['title' => 'Tour Commerce Plus', 'category' => 'Commercial', 'year' => '2023', 'sort_order' => 1,
                 'description' => 'Immeuble de bureaux 8 étages, certification HQE, situé dans le quartier d\'affaires.'],
                ['title' => 'Résidence Les Palmiers', 'category' => 'Résidentiel', 'year' => '2023', 'sort_order' => 2,
                 'description' => 'Complexe résidentiel 24 appartements, piscine commune, jardins paysagers.'],
                ['title' => 'Hôtel Teranga', 'category' => 'Rénovation', 'year' => '2022', 'sort_order' => 3,
                 'description' => 'Rénovation complète d\'un hôtel 4 étoiles — 80 chambres, spa et restaurant revisités.'],
                ['title' => 'Centre Culturel Derkle', 'category' => 'Institutionnel', 'year' => '2022', 'sort_order' => 4,
                 'description' => 'Centre culturel 2 000m² — salle de spectacle, galerie d\'art et espaces communautaires.'],
                ['title' => 'Clinique Santé+', 'category' => 'Institutionnel', 'year' => '2021', 'sort_order' => 5,
                 'description' => 'Clinique médicale moderne 3 000m², équipements médicaux intégrés, certifiée ISO.'],
            ];
            foreach ($reals as $r) {
                Realization::create($r);
            }
        }
    }
}
