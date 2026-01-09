
Système de Gestion de Parking-Intelligent

Une application web simple pour gérer un parking : suivre les véhicules, les places, calculer les frais et générer des tickets.

Fonctionnalités

* Ajouter des véhicules dans les places libres
* Suivi de l’heure d’entrée, du type de véhicule et du numéro de place
* Calcul automatique des frais de stationnement selon la durée
* Sortie des véhicules avec génération de ticket
* Affichage de l’occupation des places
 Prérequis

* Node.js v22+
* npm v10+
* Un fichier JSON (`parking.json`) servant de base de données pour JSON Server


Installation

1. Cloner le projet :

bash
git clone <votre-url-de-repo>
cd Système-de-Gestion-de-Parking-Intelligent

2. Installer JSON Server globalement (optionnel) :

bash
npm install -g json-server


Ou utiliser `npx` sans installation globale.



Pour lancer JSON Server :

bash
npx json-server --watch parking.json --port 3000


Le backend sera disponible sur :

* Véhicules : `http://localhost:3000/vehicles`
* Places de parking : `http://localhost:3000/parkingPlaces`

Lancer le Frontend

1. Ouvrir `index.html` dans un navigateur (pas besoin de serveur pour les fichiers statiques)
2. Utiliser l’interface pour ajouter ou sortir des véhicules
3. Le bouton **“Sortir”** génère un ticket et libère la place

---

## Notes

* Toutes les données sont stockées dans `parking.json` via JSON Server
* Les frais de stationnement sont calculés automatiquement :

  * Première heure : 5 MAD
  * Heures supplémentaires : 3 MAD par heure
* Actualisez la page pour voir les véhicules et les places mises à jour
<img width="1881" height="854" alt="Capture d&#39;écran 2026-01-09 175218" src="https://github.com/user-attachments/assets/9baf90cd-772f-4ee9-85a6-ddeffdd7c861" />


