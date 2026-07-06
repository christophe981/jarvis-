# Prompts : Clients, Chantiers, Devis (MVP Pilotage BTP)

> Prompts à coller dans Claude Design (claude.ai/design), un par un, pour
> générer les écrans 2 à 4 de l'application (après l'écran Dashboard, voir
> `2026-07_prompt-dashboard-btp_claude-design.md`). Chaque prompt reprend le
> même bloc "CONTEXTE" et "IDENTITÉ VISUELLE" pour rester cohérent avec le
> Dashboard déjà généré : colle-le en premier dans la conversation Claude
> Design, colle une image ou décris le rendu du Dashboard pour que Claude
> Design garde le même style, puis enchaîne avec la section "ÉCRAN À CRÉER"
> de chaque prompt ci-dessous, un écran à la fois.

---

## Bloc commun à coller avant chaque écran (si nouvelle conversation Claude Design)

Tu vas créer l'interface d'une application web SaaS pour des dirigeants de TPE
du BTP (bâtiment/travaux publics). Génère du HTML/CSS propre, sémantique et
responsive (mobile-first), avec des classes nommées par composant pour que je
puisse porter facilement le résultat vers des composants React/Tailwind.

--- CONTEXTE PRODUIT ---
L'application aide les dirigeants de TPE du BTP à piloter leur activité :
suivi de chantiers, gestion de clients, devis, factures, relances automatiques
et reporting. Utilisateurs cibles : patrons BTP peu à l'aise avec la tech, qui
consultent souvent depuis leur téléphone sur un chantier. Interface immédiate
à comprendre, sans jargon technique.

--- IDENTITÉ VISUELLE (strict, identique au Dashboard déjà généré) ---
- Couleur principale : navy #0f2742 / secondaire #14385f
- Accent : #ff7a1a (hover #e96606)
- Texte principal #1c2733, texte atténué #5b6b7b, bordures #e3e9f0
- Fond doux #f5f8fc, blanc #ffffff pour les cartes
- Police Inter (400 à 800), rayon de bordure 14px, style "pill" sur boutons
- Sidebar fixe à gauche (navy, ~230px), contenu à droite (fond #f5f8fc),
  topbar blanche avec nom d'organisation + menu utilisateur
- Navigation sidebar : Dashboard, Clients, Chantiers, Devis, Factures,
  Relances, Rapports, puis Paramètres/Abonnement séparé en bas

---

## Écran 2 : Clients

--- ÉCRAN À CRÉER : Liste des clients ---

1. En-tête de page : titre "Clients" + sous-titre "Les clients de votre
   entreprise" + bouton principal "Nouveau client" (pill, accent orange) en
   haut à droite.

2. Tableau des clients (colonnes) : Nom, Entreprise, Email, Téléphone, puis
   une colonne actions (icône "..." ouvrant un menu Modifier/Supprimer).
   Lignes avec hover léger (fond #f5f8fc).

3. Formulaire "Nouveau client" / "Modifier" (à afficher comme une modale
   centrée, fond blanc, coins arrondis 14px, overlay sombre semi-transparent
   derrière) avec les champs, dans cet ordre : Nom (obligatoire), Entreprise,
   Email, Téléphone (2 colonnes), Adresse, SIRET, Notes (zone de texte). Bouton
   "Créer le client" en pill orange en bas à droite de la modale.

4. États à générer :
   - Vide : message centré "Aucun client pour l'instant" + bouton "Nouveau
     client" dans un cadre en pointillés.
   - Peuplé : 6 à 8 clients avec des noms d'entreprises BTP françaises
     réalistes (ex : "Dupont Rénovation", "Martin Toiture", "SARL Lefèvre
     Maçonnerie"), emails/téléphones plausibles.

5. Responsive : sur mobile, le tableau devient une pile de cartes (une carte
   par client, nom en gras + entreprise en dessous + icône téléphone/email
   cliquables), la modale de formulaire passe en plein écran.

---

## Écran 3 : Chantiers (liste + détail à onglets)

--- ÉCRAN À CRÉER : Liste des chantiers ---

1. En-tête : titre "Chantiers" + sous-titre "Vos chantiers en cours et à
   venir" + bouton "Nouveau chantier" en haut à droite.

2. Rangée de filtres sous l'en-tête : pills cliquables "Tous" (actif par
   défaut, fond navy) / "À venir" / "En cours" / "Terminé" / "Archivé"
   (inactifs : fond blanc, bordure #e3e9f0).

3. Tableau : Nom du chantier, Client, Statut (badge coloré : à venir = gris,
   en cours = orange, terminé = vert discret, archivé = gris clair), Fin
   estimée. Le nom du chantier est cliquable (ouvre le détail).

4. État peuplé : 5 à 7 chantiers réalistes ("Rénovation toiture - Maison
   Dupont", "Extension garage - Villa Martin", "Ravalement façade -
   Copropriété Les Tilleuls"...), mix de statuts.

--- ÉCRAN À CRÉER : Détail d'un chantier ---

1. En-tête : nom du chantier + badge de statut à côté, sur la même ligne.

2. Deux onglets sous l'en-tête : "Infos" (actif par défaut) et "Avancement",
   style onglets simples (soulignement orange sur l'onglet actif).

3. Onglet Infos : formulaire (pas une modale, directement dans la page, en
   colonne de largeur max ~500px) avec les champs Nom du chantier, Client
   (menu déroulant), Statut (menu déroulant), Adresse, Date de début / Fin
   estimée (2 colonnes), Budget estimé (€), Description (zone de texte).
   Bouton "Enregistrer" en bas à droite.

4. Onglet Avancement :
   a. Formulaire d'ajout en haut : Avancement (%, champ nombre), zone
      d'upload de photos (bouton "Choisir des fichiers" avec icône appareil
      photo), Note (zone de texte), bouton "Ajouter la mise à jour".
   b. En dessous, une timeline verticale des mises à jour passées : chaque
      entrée = carte avec date en haut, pourcentage d'avancement à droite,
      note en dessous, puis une rangée de miniatures photo (carrés arrondis,
      ~96px, object-fit cover) si des photos sont présentes.
   c. Génère 2-3 entrées d'exemple avec progression croissante (25% puis 60%
      puis 90%), notes courtes réalistes ("Coulage de la dalle terminé",
      "Pose de la charpente en cours"), et des placeholders de photos
      (rectangles gris avec icône image, pas besoin de vraies photos).

5. Responsive : onglets et formulaire s'empilent naturellement sur mobile, le
   sélecteur de photos reste bien visible et facile à toucher (zone tactile
   généreuse, c'est l'usage principal sur chantier).

---

## Écran 4 : Devis

--- ÉCRAN À CRÉER : Liste des devis ---

1. En-tête : titre "Devis" + sous-titre "Vos devis émis à vos clients" +
   bouton "Nouveau devis".

2. Tableau : Numéro (ex "DEV-2026-001"), Client, Statut (badge : brouillon =
   gris, envoyé = bleu/navy clair, accepté = vert, refusé = rouge discret,
   expiré = gris foncé), Montant TTC, Émis le.

3. État peuplé : 5-6 devis avec numéros séquentiels, montants réalistes
   (quelques centaines à quelques milliers d'euros), mix de statuts.

--- ÉCRAN À CRÉER : Formulaire / détail d'un devis ---

1. En-tête : numéro du devis + badge de statut + actions à droite : bouton
   secondaire "Télécharger le PDF" (icône téléchargement) et bouton(s) de
   transition de statut selon le cas ("Marquer comme envoyé" si brouillon,
   ou "Marquer accepté" / "Marquer refusé" si déjà envoyé).

2. Si statut "Brouillon" : formulaire éditable (colonne ~600px) avec Client
   (menu déroulant), Chantier (menu déroulant, optionnel), Date d'émission,
   Valable jusqu'au, TVA (%) sur une même rangée (3 colonnes) ; puis une
   section "Lignes du devis" : tableau éditable avec colonnes Description,
   Qté, Unité, Prix unitaire, et un bouton "Ajouter une ligne" au-dessus,
   une icône poubelle par ligne pour la supprimer ; puis un encart total
   aligné à droite (fond #f5f8fc) affichant Total HT et Total TTC en gras ;
   puis Notes/conditions (zone de texte) ; bouton "Créer le devis"/"Enregistrer".

3. Si statut différent de "Brouillon" : vue lecture seule façon vrai
   document (fond blanc, cadre avec ombre légère) : nom client + date en
   haut, tableau des lignes, totaux alignés à droite, notes en bas.

4. Génère l'état peuplé avec 3 lignes réalistes de devis BTP (ex :
   "Fourniture et pose de tuiles - 45m²" à 38€/m², "Main d'œuvre couverture -
   3 jours" à 320€/jour, "Évacuation gravats" forfait 150€), TVA 20%, totaux
   HT/TTC calculés en conséquence.

---

## Rappel workflow d'intégration (identique aux écrans précédents)

Une fois chaque écran généré par Claude Design : les tokens CSS sont mappés
dans `tailwind.config.ts`, le markup est reporté à la main dans les
composants React déjà existants sous
`livrable/applications/2026-07_pilotage-btp_nextjs/src/components/{clients,chantiers,devis}/`
(fonctionnalité déjà branchée à Supabase, seul le visuel change), les données
factices de Claude Design sont ignorées au profit des vraies données déjà
affichées par l'application.
