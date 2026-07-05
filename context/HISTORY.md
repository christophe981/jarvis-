# Workspace History

> Journal chronologique de toutes les sessions et décisions importantes.
> Le plus récent en haut. Mis à jour automatiquement par Claude.
>
> **Comment ça marche :** Quand je lance la commande `/update` après une session importante, ou quand je raconte un changement significatif, Claude ajoute une entrée ici automatiquement. Je n'ai pas à écrire ce fichier manuellement.

---

## 2026-07-05

### Démarrage du MVP "Pilotage BTP" et clarification du modèle économique
- Construction du MVP SaaS BTP démarrée avec Claude : Next.js 16 + Supabase + Vercel, dans `livrable/applications/2026-07_pilotage-btp_nextjs/`
- Phase 0 terminée et déployée : authentification, création d'organisation, dashboard, multi-tenant avec isolation RLS. Live sur https://pilotage-btp.vercel.app
- Phase 1 terminée : CRUD clients et chantiers, upload de photos de chantier (bucket Storage privé), dashboard connecté aux vraies données
- Décision stratégique : ce n'est pas seulement un outil interne pour les clients pilotes, c'est un vrai produit SaaS destiné à être vendu en ligne via de la publicité payante sur les réseaux, en lien avec le site vitrine. Conséquence : le paiement en ligne (Stripe) est avancé dans l'ordre de construction (avant le lancement des pubs, plus tôt que prévu initialement), l'inscription reste 100 % self-service, et un lien "Essayer l'application" a été ajouté sur le site vitrine existant
- Détail complet du plan technique : voir le fichier de plan Claude Code (modèle de données, phases, prompts Claude Design)

## 2026-06-30

### Clarification de la cible et du positionnement
- Niche redéfinie : un SERVICE (automatisation/IA + gestion de projet), pas un secteur. Compétences horizontales, transférables.
- Secteur de lancement (tête de pont) : le BTP, pour la crédibilité (27 ans bâtiment/TP) et le cash rapide, malgré un dégoût assumé du secteur.
- Logique beachhead : démarrer en BTP, prouver le modèle, puis pivoter vers un univers plus désiré.
- Angle qui réconcilie le dégoût : "je connais la galère admin du BTP par cœur, je sais la faire disparaître".
- Pitch court validé : "J'aide les dirigeants de TPE du BTP à arrêter de crouler sous l'administratif. Je structure leurs opérations et j'automatise les tâches chronophages (devis, relances, reporting) avec des systèmes et de l'IA."
- Décision : refonte des textes du site vitrine (l'ancien reflétait un positionnement généraliste et dispersé). Nouveaux textes dans livrable/site-web/.

### Visio juridique avec Me Camille Pipelier (création auto-entreprise)
- Décision : création d'une auto-entreprise (régime BNC) via le guichet unique.
- Fiscalité : versement forfaitaire libératoire 2,2 %, franchise en base de TVA (seuil 41 250 €), plafond CA 77 700 €.
- Social : cotisations BNC 25,8 % (formation pro incluse), déclaration trimestrielle au démarrage.
- Facturation : Conto retenu (facturation électronique obligatoire dès septembre 2026).
- Contrats OBM : forfait 1 500 € HT proposé par le cabinet, à déclencher une fois les premiers clients acquis.
- Actions : transmettre un justificatif de domicile, signer le pouvoir de création.
- Détail complet : context/import/2026-06-30-visio-juridique-camille.md

## 2026-06-25

### Test Notion + Canva : tableau de bord "Ma méthode de travail"
- Première session de test des intégrations Notion et Canva
- Création d'un tableau de bord Notion synthétisant ma méthode de travail avec Jarvis (qui je suis, objectifs, règles de communication, commandes)
- Génération d'un visuel récapitulatif sur Canva (infographie), exporté en PNG
- Conclusion : le combo Notion + Canva fonctionne, base réutilisable pour de futurs livrables clients

### Installation initiale du Jarvis
- Workspace personnalisé pour Christophe Lachaud, basé à Périgueux (Dordogne), 47 ans, marié, père de 3 enfants
- Profil principal : mix (employé à temps plein + freelance en lancement)
- Activité : agent de maîtrise VRD dans la fonction publique territoriale (15 ans) + lancement comme OBM freelance
- Objectifs court terme identifiés : finaliser et formuler l'offre OBM, décrocher 2 premiers clients ciblés, générer 2 500 à 5 000 euros de complément mensuel
- Vision long terme : quitter la fonction publique, vivre de son activité, liberté et sérénité familiale, expertise reconnue dans une niche précise
- Projets actifs au démarrage : finaliser la formation OBM, créer le statut auto-entrepreneur et des contrats conformes, définir offre et niche, devenir expert en prospection (LinkedIn/Instagram/site), à terme créer une application sport ou BTP
- Domaine d'aide prioritaire : la prospection, pour décrocher un premier client puis affiner l'accompagnement
- Style de communication choisi : un mélange selon le contexte (direct et pédagogique)
- Demande complémentaire : mise en place d'une alerte sonore lors des demandes d'autorisation (hook Notification)
