# Prompt : refonte visuelle avec photos et illustrations (MVP Pilotage BTP)

> Prompt à coller dans Claude Design (claude.ai/design). Idéalement dans la
> même conversation que les écrans Dashboard/Clients/Chantiers/Devis déjà
> générés (pour garder la cohérence), en rappelant "voici le style déjà
> validé" avant de coller ce prompt. Sinon, dans une nouvelle conversation, en
> collant d'abord le bloc "CONTEXTE + IDENTITÉ VISUELLE" ci-dessous.

---

## Pourquoi ce prompt

Repère (relecture de pilotagebtp.com) : le site concurrent mélange des
**photos réelles de chantiers/ouvriers** avec des **illustrations sobres**,
une palette neutre, des témoignages avec avatars. Notre appli a déjà
l'identité de marque (navy/orange) et la structure (sidebar, tableaux,
badges) — ce qui lui manque pour paraître plus abouti, c'est la couche
visuelle : de vraies photos de chantier et quelques illustrations sur les
écrans qui en sont dépourvus (listes texte, états vides).

Point important : Claude Design ne peut pas connaître vos vraies photos de
chantier. Ce prompt utilise donc des **images de substitution** (service
gratuit `picsum.photos`, à seed fixe pour un rendu stable et reproductible)
pour simuler l'effet visuel. À l'intégration dans le code, ces placeholders
seront remplacés par les **vraies photos déjà stockées dans l'application**
(les photos uploadées par vos clients dans l'onglet Avancement d'un chantier
existent déjà en base, via Supabase Storage) — aucune nouvelle
fonctionnalité à construire pour ça, seulement du branchement.

---

## Bloc commun à coller en premier (si nouvelle conversation)

Tu vas faire évoluer l'interface d'une application web SaaS pour des
dirigeants de TPE du BTP (bâtiment/travaux publics), déjà conçue dans cette
identité visuelle. Génère du HTML/CSS propre, sémantique et responsive
(mobile-first), avec des classes nommées par composant pour un portage facile
vers des composants React/Tailwind.

--- CONTEXTE PRODUIT ---
L'application aide les dirigeants de TPE du BTP à piloter leur activité :
suivi de chantiers (avec photos d'avancement), gestion de clients, devis,
factures, relances automatiques, reporting. Utilisateurs cibles : patrons BTP
peu à l'aise avec la tech, qui consultent souvent depuis leur téléphone sur un
chantier.

--- IDENTITÉ VISUELLE (strict, identique aux écrans déjà générés) ---
- Couleur principale : navy #0f2742 / secondaire #14385f
- Accent : #ff7a1a (hover #e96606)
- Texte principal #1c2733, texte atténué #5b6b7b, bordures #e3e9f0
- Fond doux #f5f8fc, blanc #ffffff pour les cartes
- Police Inter (400 à 800), rayon de bordure 14px, style "pill" sur boutons
- Sidebar fixe à gauche (navy, ~230px), contenu à droite (fond #f5f8fc),
  topbar blanche avec nom d'organisation + menu utilisateur

---

## Instruction transversale : photos et illustrations

À appliquer sur tous les écrans ci-dessous.

1. **Photos "chantier" (mockup)** : utiliser des URLs de la forme
   `https://picsum.photos/seed/chantierNN/700/450` (remplacer `NN` par un
   nombre différent à chaque chantier pour avoir des visuels variés — ex.
   `chantier01`, `chantier02`...). Format 16:9, coins arrondis 14px cohérents
   avec le reste de l'UI, `object-fit: cover`.

2. **Chantier sans photo (état réel à prévoir)** : ne jamais laisser un cadre
   vide ou une icône d'image cassée. Prévoir un fond dégradé navy
   (#0f2742 → #14385f) avec une icône simple de bâtiment/grue en blanc semi-
   transparent au centre, comme visuel de repli.

3. **Illustrations décoratives** (bandeau dashboard, états vides) : SVG plat,
   deux couleurs (navy + orange), style trait fin cohérent d'un écran à
   l'autre. Pas de clipart générique multicolore, pas de photos à cet
   usage-là — l'objectif est la sobriété, pas la surcharge.

---

## Écran Dashboard — évolutions

1. Bandeau d'en-tête ("Bienvenue, [Nom Entreprise]") : ajouter en arrière-plan
   une illustration décorative discrète (silhouette de grue/bâtiments en
   motif répété, navy sur navy, opacité ~8-10 %, ne doit jamais gêner la
   lecture du texte par-dessus).

2. Section "Chantiers en cours" : chaque ligne/carte affiche désormais une
   miniature photo (carrée ou rectangulaire arrondie, ~56-64px) du chantier
   avant son nom — utiliser les photos de substitution de l'instruction 1
   ci-dessus. Garde les colonnes déjà en place (client, statut, avancement,
   date de fin estimée).

---

## Écran Chantiers (liste) — passage en galerie de chantiers

Remplacer le tableau texte actuel par une **grille de cartes photo** (plus
proche de ce que fait pilotagebtp.com, plus interactif et plus lisible sur
mobile) :

1. Garder tel quel le bandeau au-dessus de la grille : compteurs, barre de
   recherche, pills de filtre par statut (Tous/À venir/En cours/Terminé/
   Archivé) — ces éléments fonctionnent déjà bien, ne pas les changer.

2. Grille responsive (3 colonnes desktop, 2 tablette, 1 mobile). Chaque
   carte :
   - Photo de couverture en haut (16:9, coins arrondis en haut seulement),
     badge de statut superposé en haut à droite de la photo (fond
     semi-transparent + texte blanc, lisible sur toute photo).
   - Sous la photo : nom du chantier (gras), nom du client (texte atténué),
     barre de progression avec pourcentage, budget estimé, date de fin
     estimée.
   - Effet hover : légère élévation (ombre portée) + agrandissement subtil de
     la photo, pour un rendu interactif.

3. Génère 6 à 8 cartes avec des noms réalistes ("Rénovation toiture - Maison
   Dupont", "Extension garage - Villa Martin", "Ravalement façade -
   Copropriété Les Tilleuls"...), mix de statuts et d'avancements, dont au
   moins un chantier "sans photo" (utilisant le visuel de repli décrit plus
   haut) pour montrer cet état aussi.

---

## Écran Chantier (détail) — photo de couverture

1. Remplacer le bandeau d'en-tête en dégradé plat actuel par la **photo de
   couverture du chantier** (la plus récente mise à jour d'avancement) en
   arrière-plan, avec un dégradé navy en surimpression (de transparent en bas
   à navy #0f2742 opaque en haut) pour garder le texte parfaitement lisible :
   nom du chantier, client, statut, adresse, budget restent au premier plan,
   en blanc.

2. Si le chantier n'a pas encore de photo : dégradé navy plein (comme
   aujourd'hui) avec l'icône de repli décrite plus haut — ne jamais bloquer
   sur l'absence de photo.

3. Le reste de la page (onglets Infos/Avancement, section Documents liés)
   reste inchangé.

---

## États vides illustrés — Clients, Chantiers, Devis

Pour les trois écrans (liste clients vide, liste chantiers vide, liste devis
vide), remplacer le cadre en pointillés actuel (texte seul) par :

1. Une illustration SVG plate simple centrée au-dessus du texte (deux
   couleurs navy/orange, ~120px) :
   - Clients : icône de carnet de contacts / carte de visite.
   - Chantiers : icône de bâtiment en construction / grue.
   - Devis : icône de document avec un crayon.

2. En dessous : le message existant ("Aucun X pour l'instant") + le bouton
   d'action déjà en place, inchangés.

---

## Bonus optionnel (à ta discrétion, pas indispensable)

Les écrans Connexion/Inscription/Onboarding sont volontairement restés en
style shadcn/ui simple lors de la première passe visuelle (formulaires
d'authentification, faible valeur différenciante). Si tu veux pousser la
cohérence jusque-là avant le lancement des publicités (première impression
d'un visiteur payant), un prompt séparé pourra être préparé plus tard pour un
écran de connexion en deux colonnes (formulaire à gauche, photo de chantier +
citation client à droite) — pas nécessaire pour cette itération, à
mentionner si tu veux qu'on l'ajoute.

---

## Rappel workflow d'intégration (identique aux écrans précédents)

Une fois généré par Claude Design : les nouveaux tokens visuels (s'il y en a)
sont vérifiés contre `globals.css`, le markup est reporté à la main dans les
composants React existants sous
`livrable/applications/2026-07_pilotage-btp_nextjs/src/components/` et
`src/app/(app)/`, les photos de substitution `picsum.photos` sont remplacées
par les vraies URLs signées déjà générées par `getSignedPhotoUrl()` (photos
réelles des chantiers, déjà en base via `chantier_updates.photo_urls`), et
les illustrations SVG sont intégrées telles quelles comme composants ou
fichiers statiques.
