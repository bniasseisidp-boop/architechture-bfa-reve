# Pilar Construction — Site Vitrine

> **Stack**: React (Vite) + Laravel 9 + SQLite (dev) / MySQL (prod)  
> **Développé par**: MULTI BRAIN TECH

---

## 🚀 Démarrage Rapide

### 1. Backend Laravel (port 8000)
```bash
cd pilar-backend
# Déjà installé et seedé. Lancer :
php artisan serve
```

### 2. Frontend React (port 5173)
```bash
cd pilar-frontend
npm install
npm run dev
```

Ouvrir **http://localhost:5173**

---

## 🔐 Connexion Admin
- **URL** : http://localhost:5173/admin/login  
- **Email** : `moussasene@pilarconstruction.com`  
- **Mot de passe** : `pilar@2024`

---

## 📁 Structure
```
pilar-backend/      ← API Laravel (REST)
pilar-frontend/     ← Application React (Vite)
```

## 🗄️ Base de données
Utilise SQLite par défaut (`pilar-backend/database/database.sqlite`).

**Pour MySQL (XAMPP)** : modifier `pilar-backend/.env` :
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pilar_construction
DB_USERNAME=root
DB_PASSWORD=
```
Puis : `php artisan migrate --seed`

---

## ✨ Fonctionnalités
| Section       | Description |
|---------------|-------------|
| 🏠 Accueil     | Hero animé avec système de particules interactif |
| 🏗️ Services    | Grille animée, chargée depuis l'API |
| 🏛️ Réalisations | Portfolio filtrable par catégorie |
| 👤 Fondateur   | Section dédiée à Baye Assane Niasse |
| 👥 Équipe      | Membres chargés depuis l'API |
| 📋 Devis       | Formulaire complet envoyé à l'admin |
| 📞 Contact     | Informations + formulaire de contact |
| ⚙️ Admin       | Dashboard complet CRUD |

---

*Conçu et développé par **MULTI BRAIN TECH***
