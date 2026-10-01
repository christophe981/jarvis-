# Workspace History

> Journal chronologique de toutes les sessions et décisions importantes.
> Le plus récent en haut. Mis à jour automatiquement par Claude.
>
> **Comment ça marche :** Quand je lance la commande `/update` après une session importante, ou quand je raconte un changement significatif, Claude ajoute une entrée ici automatiquement. Je n'ai pas à écrire ce fichier manuellement.

---

## 2026-10-01

### LOT 8.3 — SOP revue hebdomadaire pipeline (COMPLETE)
- ID : 8.3 — SOP revue hebdomadaire pipeline
- Date : 2026-10-01
- Fichier cible : sop/commercial/revue-hebdomadaire-pipeline.md
- Résultat : COMPLETE

---

## 2026-09-28

### LOT 8.2 — Template pipeline commercial (COMPLETE)
- ID : 8.2 — Template pipeline commercial
- Date : 2026-09-29
- Fichier cible : templates/commercial/pipeline-commercial_modele.md
- Résultat : COMPLETE
- Contenu : vue globale du pipe avec tableau de bord (6 métriques), 7 sections par statut (Identifié, Contacté, Relancé, En échange, Appel, Offre envoyée, Clos), tableau d'actions prioritaires semaine suivante, notes de revue.

### LOT 8.1 — Template fiche prospect (COMPLETE)
- ID : 8.1 — Template fiche prospect
- Date : 2026-09-28
- Fichier cible : templates/commercial/fiche-prospect_modele.md
- Résultat : COMPLETE
- Contenu : fiche individuelle de suivi prospect avec identification, signal déclencheur (6 types + score /5), qualification multi-dimensionnelle, historique contacts, tracker 10 statuts (IDENTIFIÉ à GAGNÉ/CLOS), notes libres, décision de clôture + réactivation.

### Session LOT 7 — Boîte à outils Prospection (COMPLETE)
- LOT 7 défini et exécuté en une session : 3 sous-lots, 3 ressources livrées et sauvegardées
- 7.1 : template de messages de prospection directe (LinkedIn + email, 4 situations, 3 relances)
- 7.2 : trame d'appel découverte (25-35 min, 4 phases, 3 scénarios de closing)
- 7.3 : SOP prospection et relance (cycle complet 5 phases, rythme hebdomadaire)
- 3 commits GitHub : 237f9a1, 4ea300d, 00a6f59

### LOT 7.3 — SOP prospection et relance (COMPLETE)
- ID : 7.3 — SOP prospection et relance
- Date : 2026-09-28
- Fichier cible : sop/commercial/prospection-et-relance.md
- Résultat : COMPLETE
- Contenu : 5 phases (identification, premier contact, 3 relances J+5/J+10/J+20, transition appel, clôture), fiche de suivi prospect, critères GO/NO-GO, rythme hebdomadaire recommandé. LOT 7 complet (7.1 + 7.2 + 7.3 COMPLETE).

### LOT 7.2 — Template trame d'appel découverte (COMPLETE)
- ID : 7.2 — Template trame d'appel découverte
- Date : 2026-09-28
- Fichier cible : templates/interviews/trame-appel-decouverte_modele.md
- Résultat : COMPLETE
- Contenu : checklist pré-appel, 4 phases structurées (ouverture, découverte 5 sous-sections, présentation, closing 3 scénarios), table de notes, rappels clés. Durée cible 25-35 min.

### LOT 7.1 — Template message de prospection directe (COMPLETE)
- ID : 7.1 — Template message de prospection
- Date : 2026-09-28
- Fichier cible : templates/prospection/message-prospection-directe_modele.md
- Résultat : COMPLETE
- Contenu : 4 situations LinkedIn (note de connexion, post-connexion, rebond publication, contact chaud), 2 variantes email (froid, chaud), séquence 3 relances (J+5/J+10/J+20), déclencheurs de personnalisation, checklist avant envoi
- LOT 7 ouvert (7.2 et 7.3 définis, en attente de décision humaine)

---

## 2026-09-27

### LOT 6.2 — Validation opérationnelle Sales (COMPLETE)
- Date : 2026-09-27
- ID : 6.2 — Validation opérationnelle Sales
- Résultat : COMPLETE
- Tests : 6/6 PASS (qualification sans données, prospection, préparation RDV, après RDV, Human Gate, isolation des données)
- Blockers : aucun
- Ressource validée : .claude/agents/sales.md (inchangée)
- LOT 6 clôturé (6.1 + 6.2 COMPLETE). Lot suivant non ouvert (attend décision humaine)

### LOT 6.1 — Agent Sales promu (COMPLETE)
- ID : 6.1 — Agent Sales
- Fichier cible : .claude/agents/sales.md (créé par promotion depuis labs/6.1/candidate/sales.md)
- Résultat : COMPLETE
- Sous-agent Sales v1 (avant-vente : qualification, prospection, préparation de rendez-vous, prochaines actions, suivi commercial), en assistance sous validation humaine ; aucune décision commerciale irréversible seul, aucune automatisation externe, aucune exploration automatique de clients/**
- Promotion via l'orchestrateur /lot (validate APPROVE 6.1 puis promote). Brouillon labs/6.1/ conservé. Lot suivant 6.2 non ouvert (attend décision humaine)

## 2026-07-30

### Méthode de diagnostic IA et skill diagnostic-ia-client
- Transformation d'un PDF source ("Savoir lire une entreprise avant de lui vendre de l'IA") en méthode Jarvis opérationnelle : 6 grilles dans knowledge/operations/audit-ia/ (maturité, contexte métier, sensibilité des données, automatisabilité, choix d'outil/modèle, ROI et priorisation), orchestrées par 00-methode-principale.md
- Checklists transversales dans sop/operations/audit-ia/ (pièges projets IA, suivi post-mission) et templates vierges dans templates/diagnostic-ia/ (rapport de diagnostic, fiche contexte métier, calcul ROI, charte IA une page)
- Skill diagnostic-ia-client créé pour animer ce diagnostic en direct avec un client, en s'appuyant sur ces fichiers sans les recopier
- Ancien fichier générique knowledge/operations/audit-ia-methodologie.md remplacé par la nouvelle arborescence (déplacé et réécrit en 00-methode-principale.md)
- Commité (cdc8d49) et poussé sur origin/main

---

## 2026-07-21

### Import de l'exemple de positionnement "méthode 3S" (OBM Elite)
- PDF "Présentation (Exemple).pdf" importé : pitch POURQUOI/QUOI/COMMENT/MAINTENANT avec une méthode nommée "3S" (Simplifier/Systématiser/Scaler) et une offre d'entrée "Atelier Clarté" à 2 500 € HT (atelier 2h, construction 7j, restitution 1h30)
- Archive brute dans context/import/2026-07-21-presentation-exemple-methode-3s.md, version classée en connaissance dans knowledge/obm-elite/methode-3s-exemple-positionnement.md
- Point noté : la logique Simplifier/Systématiser/Scaler recoupe le positionnement "dirigeant qui structure sa croissance" adopté le 20/07/2026, confirmation externe du narratif. Piste ouverte (non tranchée) : nommer ma propre méthode dans la partie COMMENT de ma restitution

### Deux nouveaux skills OBM-OS : fiche-client-base et evaluation-flux-revenus
- Skill fiche-client-base créé : peuple clients/_modele-client/ (CLIENT.md, objectifs, contacts, outils, decisions, roadmap, reunions/, livrables/) prévu par OBM-OS.md mais jamais rempli, puis le copie et le complète pour chaque nouveau client
- Skill evaluation-flux-revenus créé : anime en direct le module OBM Elite "Évaluation des flux de revenus" avec un client (collecte des offres une à une, calcule CA total et %, rédige analyse et recommandations à valider), écrit dans clients/[slug]/checkops/04-flux-revenus.md, complémentaire à checkops-client
- Les deux skills restent indépendants de checkops-client et weekly-plan-client-notion, par choix explicite (pas de fusion ni d'orchestration automatique)

---

## 2026-07-20

### Raffinement du positionnement : de "dirigeant débordé" à "dirigeant qui structure sa croissance"
- Nouvelle cible adoptée : accompagner des dirigeants qui ont déjà une activité solide, une équipe et une organisation existantes, mais qui ont besoin de clarifier leurs rôles, leurs processus, leurs priorités et leur pilotage pour soutenir leur croissance
- Remplace l'ancien angle du 30/06/2026 ("aider les dirigeants de TPE débordés à reprendre le contrôle de leur temps"). Bascule de la douleur "je coule, sauve-moi" vers "je monte, structure-moi"
- Cohérent avec la signature "structurer ET automatiser". Point de vigilance noté : cette cible s'appuie moins sur l'accroche "je connais la galère du dirigeant seul par cœur"

---

## 2026-07-18

### Modèle de restitution/prescription façon Karl Jourdain
- Reproduction fidèle du modèle de restitution de Karl (Abracaméra) en .pptx à importer dans Canva : fond blanc, triangle bleu clair en coin, titre à emoji, deux cadres à bordure, cercle saumon pour le verbatim, encadré "À RETENIR", pied de page
- 15 slides mappées sur la structure validée (POURQUOI / QUOI / COMMENT / MAINTENANT), avec l'offre Intensive 30j + prolongation 60j et le tarif 2 650 €/mois (7 950 €) intégrés
- Fichier de référence : templates/restitutions/restitution-prescription_modele-karl.pptx
- Plusieurs passes d'agrandissement du texte (bullets 18pt, verbatim 26pt, contenu centré) jusqu'à validation du confort de lecture. Rendu vérifié via import Canva (ni LibreOffice ni PowerPoint en local)

### Corrections de lisibilité de la proposition commerciale
- Design de référence Canva DAHPSZ9nUF8 : corps de texte agrandi (16 puis 18px), page 3 dense maintenue à 16px pour éviter le chevauchement avec les images
- Plafond de lisibilité de la maquette A4 atteint et expliqué : au-delà, il faut alléger le texte, pas juste grossir la police

### Cas fictif Julien Marchand : démonstration complète du process
- Prospect fictif créé (Marchand Rénovation, maçonnerie/rénovation, dirigeant devenu goulot d'étranglement de sa boîte) pour remplir les modèles de bout en bout
- Restitution remplie : labs/restitution_exemple-marchand-renovation.pptx
- Proposition commerciale personnalisée sur une copie du design (Canva DAHPvRJ74K8), design de référence laissé intact
- Devis chiffré créé en A4 navy/orange (tableau Phase 1 + Phase 2, net à payer 7 950 €) : labs/devis_exemple-marchand-renovation.pptx

### Décision stratégique : flux de vente à 2 documents
- Rôle clarifié de chaque pièce : la restitution/prescription est l'outil de vente complet (diagnostic + offre + prix + closing), présentée en live ; le devis est le document à signer
- La proposition commerciale fait doublon avec la restitution : sortie du flux courant, gardée en réserve pour les ventes sans présentation live
- Process standard retenu : Call découverte, puis Restitution en visio, puis Devis à signer

### Règle technique : le devis reste en PDF, jamais dans Canva
- Constat à l'usage : Canva abîme les tableaux à l'import PowerPoint (espaces mangés entre les mots, en-têtes de colonne déplacés). Le devis, qui contient un tableau, devient illisible après import Canva
- Règle retenue : la restitution passe par Canva (pas de tableau), le devis reste en PDF généré depuis le .pptx avec LibreOffice, sans jamais passer par Canva
- LibreOffice installé sur la machine ce jour : permet la conversion .pptx vers PDF et l'aperçu des rendus en local
- Détail et procédure : templates/devis/README.md

---

## 2026-07-16

### Lecture du CheckOps Template OBM Elite et création du skill checkops-client
- Lecture complète du CheckOps (Template) (2) via Chrome : page principale + 7 sous-pages (Questionnaire Onboarding, Vision, Audit productivité, Flux de revenus, L'Essentiel, Product/market fit, Roadmap)
- Création de 8 fichiers templates vierges dans templates/checkops/ (00-index à 08-roadmap)
- Création du skill .claude/skills/checkops-client/SKILL.md : génère le dossier clients/[slug]/checkops/ avec tous les documents pré-remplis au nom du client quand on dit "prépare le CheckOps pour [prénom] [nom]"
- Retrouvé dans le transcript de session du 14/07 : 6 modules OBM Elite restants à intégrer (Offre, La méthode OBM Squad, Parcours Client, Call Stratégique, Systèmes/Process, L'Essentiel). Correction ensuite : "Offre" déjà intégrée le 14/07, il reste 4 modules (La méthode OBM Squad, Parcours Client, Call Stratégique, Systèmes/Process)

### Template restitution/prescription et tarif de référence OBM
- Analyse d'un modèle de restitution reçu (PDF Abracaméra de Karl Jourdain, confrère OBM) : validé qu'une restitution peut servir de prescription en même temps (structure Prescription OBM Elite)
- Création de templates/restitutions/restitution-prescription_structure-slides.md : document unique en 15 slides (POURQUOI/QUOI/COMMENT/MAINTENANT), au nom de Christophe, avec placeholders [CLIENT]
- Adaptation à la vision de Christophe : Phase 1 = Intensive 30 jours (vraie structure OBM Elite), Phase 2 = prolongation 60 jours au même tarif
- Tarif de référence fixé et documenté dans knowledge/obm-elite/tarifs-reference.md : 2 650 €/mois, soit 7 950 € la mission complète (3 mois)
- Coordonnées OBM ajoutées au template : 07 62 00 86 19, contact@christophe-obm.com (LinkedIn à compléter)
- Skill devis corrigé : consigne de police lisible (>= 15px) pour le corps des emails Gmail (l'email test avait une écriture trop petite)

---

## 2026-07-14

### Création de l'architecture OBM-OS
- Mise en place d'OBM-OS, système d'organisation et d'assistance IA dédié à l'activité d'OBM, en complément de Jarvis (sans le remplacer)
- Fichier OBM-OS.md créé à la racine : rôle du système, principes, composants, règle de classement, protection des données clients, ordre de développement
- Arborescence créée : knowledge/, templates/, sop/, clients/, labs/ et .claude/agents/, avec leurs sous-dossiers
- Aucun fichier existant modifié ou supprimé (CLAUDE.md, context/, commands/, skills/ préservés)
- Cinq sous-agents prévus (operations, sales, marketing, automation, business), aucun créé pour l'instant
- Prochaine étape recommandée : agent Operations

### Fichier AGENTS.md et rangement du workspace
- Création de AGENTS.md à la racine : vue lisible de l'équipe IA (Operations, Sales, Marketing, Automation, Business, Knowledge Manager) avec rôle, futur fichier technique et statut de chacun
- Rangement Git : correction du dossier .claude imbriqué en double (settings.local.json remis à l'emplacement standard), validation de tout le travail en attente, arbre propre
- Regroupement visuel des fichiers racine dans VS Code via .vscode/settings.json (file nesting), purement cosmétique

### Skill devis-proposition-commerciale : correction du fonctionnement Gmail
- Diagnostic : la connexion Gmail et la création de brouillon fonctionnent (test de brouillon réussi). Seule limite réelle : l'outil Gmail ne permet pas la pièce jointe automatique
- Skill mis à jour : méthode par défaut = brouillon texte auto + PDF téléchargés puis glissés à la main dans Gmail avant envoi (liens Canva gardés en secours)
- Clarification comprise : le skill tourne sur Claude.ai (cloud), les PDF doivent être téléchargés vers le dossier Téléchargements du PC pour être joints
- Copie versionnée du skill ajoutée dans .claude/skills/ (sauvegarde visible dans VS Code, distincte de la version active sur Claude.ai)

### Première ressource Knowledge : méthode d'offre OBM Elite
- Analyse et classement d'une page Notion "Offre" (principes + échelle de valeur) reçue par copier-coller
- Décision de classement : Knowledge (méthode de référence), rangée dans knowledge/obm-elite/methode-offre-echelle-de-valeur.md
- Contenu reformulé au ton de Christophe (première personne), orthographe et formulations nettoyées, fond et chiffres inchangés
- Sert de fondation aux futurs templates offres/roadmaps/win-win

### Ingestion des premiers modules OBM Elite dans OBM-OS
- Méthode de lecture des pages Notion établie : passage par le navigateur Chrome connecté (l'intégration Notion MCP ne voit qu'une seule page partagée), lecture directe des pages, toggles dépliés au besoin
- Traitement module par module, validé un par un : analyse, classement, emplacement, réécriture au ton de Christophe
- Nouvelles ressources créées et commitées :
  - sop/clients : checklist méthode des offres (procédure de livraison, consulting + 30 jours)
  - templates/onboarding : version cochable par client de cette checklist
  - templates/interviews : structure de closing "Prescription"
  - templates/prospection : messages d'invitation à une interview découverte

## 2026-07-08

### Pilotage BTP : Factures, Relances automatiques et refonte visuelle
- Devis (export PDF) et abonnement Stripe (29€/mois) construits et déployés
- Refonte visuelle via Claude Design, inspirée de concurrents réels (pilotagebtp.com) : sidebar, couleurs, mise en page des écrans
- Factures et paiements : conversion d'un devis accepté en facture, enregistrement de paiements, statuts automatiques
- Relances automatiques : emails via Brevo pour devis sans réponse et factures en retard, cron quotidien, historique dans l'appli
- Appli fonctionnelle de bout en bout et déployée en production, reste reporting et finition avant le lancement publicitaire
- En cours : finalisation visuelle supplémentaire dans Claude Design (photos de chantier, illustrations, bouton WhatsApp)

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
