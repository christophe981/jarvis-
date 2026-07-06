# Prompt : App shell + Dashboard (MVP Pilotage BTP)

> Prompt à coller dans Claude Design (claude.ai/design) pour générer l'interface
> du premier écran de l'application "Pilotage BTP" (nom de travail provisoire).
> Écran 1 sur 7 de la séquence (voir plan MVP) : App shell + Dashboard.
> Les écrans suivants (Clients, Chantiers, Devis, Factures, Relances, Rapports)
> réutiliseront ce même prompt de base en changeant la section "ÉCRAN À CRÉER".
> Voir aussi `2026-07_prompts-ecrans-clients-chantiers-devis_claude-design.md`
> pour les écrans Clients/Chantiers/Devis.
>
> Repères concurrentiels (recherche du 06/07/2026 sur des logiciels BTP réels :
> Alobees, et le comparatif pilotagebtp.com) : sidebar de navigation fixe +
> mobile-first sont des standards du secteur, à conserver. Le "CA du mois"
> gagnerait à être décliné "par chantier" à terme (Alobees met en avant le
> suivi de rentabilité par chantier) — pas requis pour ce premier prompt, mais
> à garder en tête pour l'écran Rapports plus tard.

---

## Prompt

Tu vas créer l'interface d'une application web SaaS pour des dirigeants de TPE
du BTP (bâtiment/travaux publics). Génère du HTML/CSS propre, sémantique et
responsive (mobile-first), avec des classes nommées par composant pour que je
puisse porter facilement le résultat vers des composants React/Tailwind.

--- CONTEXTE PRODUIT ---
L'application aide les dirigeants de TPE du BTP à piloter leur activité :
suivi de chantiers, gestion de clients, devis, factures, relances automatiques
et reporting. Utilisateurs cibles : patrons BTP peu à l'aise avec la tech,
qui consultent souvent depuis leur téléphone sur un chantier. L'interface doit
être immédiatement lisible, sans jargon technique, avec une hiérarchie visuelle
claire (on doit comprendre l'état de son activité en 5 secondes).

--- IDENTITÉ VISUELLE (reprise du site vitrine existant, à respecter strictement) ---
- Couleur principale : navy #0f2742
- Navy secondaire (dégradés/hover) : #14385f
- Accent (CTA, alertes positives, éléments actifs) : #ff7a1a
- Accent hover : #e96606
- Texte principal : #1c2733
- Texte atténué : #5b6b7b
- Bordures/séparateurs : #e3e9f0
- Fond doux (arrière-plan général) : #f5f8fc
- Blanc : #ffffff (cartes, contenu principal)
- Police : Inter (400/500/600/700/800)
- Rayon de bordure : 14px sur les cartes et boutons (style "pill" sur les boutons principaux)
- Style général : sobre, professionnel, aéré, pas d'effets superflus

--- ÉCRAN À CRÉER : App shell + Dashboard ---

1. STRUCTURE GÉNÉRALE
   - Sidebar fixe à gauche (fond navy #0f2742, texte blanc), largeur ~230px,
     qui se transforme en menu hamburger/drawer sur mobile.
   - Zone de contenu principale à droite, fond #f5f8fc.
   - Topbar en haut de la zone de contenu (fond blanc, bordure basse #e3e9f0) :
     nom de l'organisation à gauche, menu utilisateur à droite (avatar initiales
     + nom + chevron, menu déroulant avec "Paramètres" et "Déconnexion").

2. NAVIGATION (sidebar)
   Dans l'ordre, avec une icône simple par item (style outline, cohérent) :
   - Dashboard (actif par défaut sur cet écran)
   - Clients
   - Chantiers
   - Devis
   - Factures
   - Relances
   - Rapports
   - Paramètres/Abonnement (en bas de la sidebar, séparé visuellement du reste)
   L'item actif doit être visuellement distinct (fond légèrement plus clair
   ou barre latérale accent #ff7a1a).

3. CONTENU DU DASHBOARD
   a. En-tête de page : "Bienvenue, [Nom Entreprise]" + sous-titre discret
      (ex : "Voici l'état de votre activité aujourd'hui").
   b. Rangée de 4 cartes statistiques (grille responsive, empilées sur mobile) :
      - "Chantiers en cours" (nombre + petite icône chantier)
      - "Devis en attente" (nombre + montant total en euros)
      - "Factures en retard" (nombre + montant total en euros, mise en évidence
        visuelle si > 0, par exemple bordure ou pastille orange)
      - "CA du mois" (montant en euros, avec petite tendance vs mois précédent
        si pertinent, ex : "+12% vs mois dernier")
   c. Section "Chantiers en cours" : liste/tableau des chantiers actifs avec
      colonnes : Nom du chantier, Client, Statut (badge coloré : à venir/en
      cours/terminé), Avancement (barre de progression %), Date de fin estimée.
   d. Section "Activité récente" : flux chronologique compact des derniers
      événements (devis envoyé, paiement reçu, avancement chantier mis à jour),
      avec icône par type d'événement, libellé court, et horodatage relatif
      (ex : "il y a 2h").

4. ÉTATS À GÉNÉRER (les 3, clairement séparés dans ta réponse)
   - État vide : aucun chantier/client/devis encore créé, avec un message
     d'accueil engageant et un bouton d'action clair ("Ajouter mon premier
     client" ou "Créer mon premier chantier").
   - État chargement : squelettes (skeletons) pour les 4 cartes et le tableau.
   - État peuplé : avec des données réalistes d'une TPE BTP française
     (5 à 8 lignes), par exemple des chantiers comme "Rénovation toiture -
     Maison Dupont", "Extension garage - Villa Martin", des montants réalistes
     en euros (quelques milliers à quelques dizaines de milliers d'euros par
     chantier), des noms de clients français courants.

5. RESPONSIVE
   - Mobile-first : sur mobile, sidebar cachée derrière un bouton menu en haut,
     cartes stats empilées en 1 colonne, tableau des chantiers en cartes
     empilées plutôt qu'en tableau classique.
   - Desktop : sidebar visible en permanence, cartes stats sur 4 colonnes,
     tableau classique.

--- LIVRABLES ATTENDUS ---
- Code HTML/CSS complet des 3 états (vide, chargement, peuplé), responsive
- Structure claire, classes CSS nommées par composant (ex : `.sidebar`,
  `.stat-card`, `.chantier-row`), facilement portable vers des composants
  React/Tailwind
- Pas de JavaScript nécessaire (interface statique, l'interactivité sera
  ajoutée séparément dans le code de l'application)
