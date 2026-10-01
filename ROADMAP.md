# Feuille de route OBM-OS - Lot 5

- [x] **Sous-lot 5.3 : Configuration du sous-agent Operations**
  - Action : Créer et configurer le sous-agent `operations.md` avec la fiche de rôle et les directives OBM-OS dans le dossier `.claude/agents/`.
  - Validation : Fichier `.claude/agents/operations.md` généré et conforme.

- [x] **Sous-lot 5.4 : Validation de la structure globale du système**
  - Action : Vérifier la présence et la cohérence de tous les fichiers cibles (`CLAUDE.md`, `.docs/ARCHITECTURE.md`, `ROADMAP.md`).
  - Validation : Arborescence validée et prête pour le Lot 6.

# Chantier Automation — avant Lot 6

> Ce chantier prépare l'automatisation du cycle des futurs lots. Ce n'est PAS un lot métier et il ne doit pas être numéroté comme tel. Chaque étape reste soumise à validation humaine.

- [x] Automation 0.1 — Audit
- [x] Automation 0.2A — Assainissement ROADMAP
- [x] Automation 0.2B — Architecture orchestrateur
- [x] Automation 0.3 — Lecteur d'état / preflight
- [x] Automation 0.4 — Préparateur labs-only
- [x] Automation 0.5 — Promotion / journalisation / sauvegarde
- [x] Automation 0.6 — Sécurité / secrets / tests documentaires
- [x] Automation 1.0 — Validation humaine finale

# LOT 6 — Agent Sales v1

Objectif global :
Créer le premier agent métier Sales de Jarvis, orienté qualification,
prospection, préparation de rendez-vous et suivi commercial,
sans automatisation externe et sans modifier les autres agents.

## 6.1 — Agent Sales

Statut : COMPLETE
Objectif :
Créer l'agent Sales v1 de Jarvis.

Action attendue :
Construire un agent commercial capable de :
- qualifier un prospect ;
- préparer une approche de prospection ;
- préparer un rendez-vous commercial ;
- structurer les prochaines actions ;
- proposer un suivi commercial ;
- rester dans une logique d'assistance et de validation humaine.

Destination cible :
.claude/agents/

Fichier cible :
.claude/agents/sales.md

Critère de validation :
Le fichier sales.md existe, respecte le format canonique des agents du workspace,
définit clairement son rôle, ses limites, ses déclencheurs et son fonctionnement,
et passe une revue humaine.

Dépendances :
Automation 1.0 COMPLETE

Autorisation humaine : APPROVED

## 6.2 — Validation opérationnelle Sales

Statut : COMPLETE

Objectif :
Valider le comportement de l'agent Sales sur des scénarios commerciaux contrôlés.

Action attendue :
Tester plusieurs situations représentatives et confirmer que l'agent :
- reste cohérent avec OBM-OS ;
- ne prend pas de décision commerciale irréversible seul ;
- produit des actions utilisables ;
- respecte les Human Gates.

Critère de validation :
Tests validés humainement et aucun blocker critique.

Dépendances :
6.1 COMPLETE

# LOT 7 — Boîte à outils Prospection

Objectif global :
Créer les templates et procédures essentiels pour outiller la prospection active :
message de premier contact, trame d'appel découverte, et SOP de prospection/relance.

## 7.1 — Template message de prospection

Statut : COMPLETE
Objectif :
Créer un template de messages de prospection directe (LinkedIn et email) adapté à la cible dirigeant BTP/TPE qui structure sa croissance.

Action attendue :
Produire un fichier template structuré avec variantes par canal (LinkedIn, email) et par situation (contact froid, contact chaud, rebond sur publication), avec placeholders clairs et séquence de relances.

Destination cible :
templates/

Fichier cible :
templates/prospection/message-prospection-directe_modele.md

Critère de validation :
Le fichier existe, couvre au minimum 3 situations de prospection avec des messages prêts à personnaliser, et a passé une revue humaine.

Dépendances :
LOT 6 COMPLETE

Autorisation humaine : APPROVED

## 7.2 — Template trame d'appel découverte

Statut : COMPLETE
Objectif :
Créer une trame d'appel découverte (téléphone ou visio) pour qualifier un prospect et structurer le premier entretien commercial.

Action attendue :
Produire un fichier template avec ouverture, questions de qualification, présentation de l'offre et closing, avec durée indicative par section.

Destination cible :
templates/

Fichier cible :
templates/interviews/trame-appel-decouverte_modele.md

Critère de validation :
Le fichier existe, couvre la structure complète d'un appel découverte (ouverture, qualification, présentation, closing), et a passé une revue humaine.

Dépendances :
7.1 COMPLETE

Autorisation humaine : APPROVED

## 7.3 — SOP prospection et relance

Statut : COMPLETE
Objectif :
Créer une procédure standard pour piloter un cycle de prospection de bout en bout : identification, premier contact, relances et clôture.

Action attendue :
Produire un fichier SOP avec les étapes séquencées, les délais de relance, les critères de go/no-go et les règles de clôture (abandon ou conversion vers appel découverte).

Destination cible :
sop/

Fichier cible :
sop/commercial/prospection-et-relance.md

Critère de validation :
Le fichier existe, couvre le cycle complet (identification → contact → relances → clôture), et a passé une revue humaine.

Dépendances :
7.2 COMPLETE

Autorisation humaine : APPROVED

# LOT 8 — Pilotage commercial

Objectif global :
Créer les outils pour suivre et piloter l'activité de prospection :
fiche individuelle par prospect, vue pipeline globale et procédure de revue hebdomadaire.

## 8.1 — Template fiche prospect

Statut : COMPLETE
Objectif :
Créer une fiche individuelle structurée pour suivre un prospect de la prise de contact jusqu'à la clôture.

Action attendue :
Produire un fichier template avec les sections : contexte du prospect, signaux déclencheurs, historique des contacts, statut actuel, prochaines actions.

Destination cible :
templates/

Fichier cible :
templates/commercial/fiche-prospect_modele.md

Critère de validation :
Le fichier existe, couvre toutes les informations nécessaires au suivi individuel d'un prospect, et a passé une revue humaine.

Dépendances :
LOT 7 COMPLETE

Autorisation humaine : APPROVED

## 8.2 — Template pipeline commercial

Statut : COMPLETE
Objectif :
Créer une vue globale de tous les prospects actifs sur une seule page pour piloter le pipeline commercial.

Action attendue :
Produire un fichier template avec un tableau par statut (Identifié, Contacté, Relancé, Appel, Clos) permettant de visualiser l'ensemble du pipe en un coup d'oeil.

Destination cible :
templates/

Fichier cible :
templates/commercial/pipeline-commercial_modele.md

Critère de validation :
Le fichier existe, offre une vue synthétique de tous les prospects par statut, et a passé une revue humaine.

Dépendances :
8.1 COMPLETE

Autorisation humaine : APPROVED

## 8.3 — SOP revue hebdomadaire pipeline

Statut : COMPLETE
Objectif :
Créer une procédure standard pour faire le point chaque semaine sur le pipeline commercial.

Action attendue :
Produire un fichier SOP avec les étapes de la revue hebdomadaire : quoi regarder, comment décider (avancer, relancer, clore), et comment planifier la semaine suivante.

Destination cible :
sop/

Fichier cible :
sop/commercial/revue-hebdomadaire-pipeline.md

Critère de validation :
Le fichier existe, couvre le déroulé complet d'une revue hebdomadaire pipeline (30 min max), et a passé une revue humaine.

Dépendances :
8.2 COMPLETE

Autorisation humaine : APPROVED

# LOT 9 — Agent Marketing

Objectif global :
Créer l'agent Marketing de Jarvis, orienté création de contenu, présence sur LinkedIn et Instagram, positionnement et communication de l'activité OBM, sans décision autonome et sans modifier les autres agents.

## 9.1 — Agent Marketing

Statut : COMPLETE
Objectif :
Créer l'agent Marketing v1 de Jarvis.

Action attendue :
Construire un agent capable de :
- préparer et structurer des publications LinkedIn et Instagram ;
- proposer des angles de contenu adaptés au positionnement OBM de Christophe ;
- aider à construire et raffiner le positionnement et le message commercial ;
- préparer des accroches, des newsletters ou des séquences de contenu ;
- rester dans une logique d'assistance et de validation humaine.

Destination cible :
.claude/agents/

Fichier cible :
.claude/agents/marketing.md

Critère de validation :
Le fichier marketing.md existe, respecte le format canonique des agents du workspace, définit clairement son rôle, ses limites, ses déclencheurs et son fonctionnement, et passe une revue humaine.

Dépendances :
LOT 8 COMPLETE

Autorisation humaine : APPROVED

# LOT 10 — Agent Automation

Objectif global :
Créer l'agent Automation de Jarvis, orienté n8n, Airtable, API, MCP et automatisations, pour assister Christophe dans la conception et la mise en œuvre de workflows automatisés, sans exécution autonome.

## 10.1 — Agent Automation

Statut : COMPLETE
Objectif :
Créer l'agent Automation v1 de Jarvis.

Action attendue :
Construire un agent capable de :
- concevoir des workflows n8n adaptés aux besoins clients ;
- structurer des bases Airtable pour le pilotage et le suivi ;
- identifier les tâches automatisables dans une activité OBM ou chez un client ;
- proposer des architectures d'automatisation simples et fiables ;
- documenter les choix techniques et les points de maintenance ;
- rester dans une logique d'assistance et de validation humaine.

Destination cible :
.claude/agents/

Fichier cible :
.claude/agents/automation.md

Critère de validation :
Le fichier automation.md existe, respecte le format canonique des agents du workspace, définit clairement son rôle, ses limites, ses déclencheurs et son fonctionnement, et passe une revue humaine.

Dépendances :
9.1 COMPLETE

Autorisation humaine : APPROVED

# LOT 11 — Agent Business

Objectif global :
Créer l'agent Business de Jarvis, orienté objectifs, indicateurs, décisions stratégiques, rentabilité et développement de l'activité OBM, pour assister Christophe dans le pilotage global de son activité.

## 11.1 — Agent Business

Statut : COMPLETE
Objectif :
Créer l'agent Business v1 de Jarvis.

Action attendue :
Construire un agent capable de :
- suivre et analyser les indicateurs clés de l'activité (CA, pipeline, rentabilité) ;
- structurer et challenger les décisions stratégiques ;
- évaluer des opportunités (nouveaux clients, nouvelles offres, pivots) ;
- produire des bilans périodiques et des points de situation ;
- rester dans une logique d'assistance et de validation humaine.

Destination cible :
.claude/agents/

Fichier cible :
.claude/agents/business.md

Critère de validation :
Le fichier business.md existe, respecte le format canonique des agents du workspace, définit clairement son rôle, ses limites, ses déclencheurs et son fonctionnement, et passe une revue humaine.

Dépendances :
10.1 COMPLETE

Autorisation humaine : APPROVED

# LOT 12 — Skill Fathom vers compte-rendu client

Objectif global :
Créer le skill Fathom vers compte-rendu client, qui récupère automatiquement
une transcription Fathom via MCP, l'analyse avec meeting-intelligence et propose
la mise à jour du dossier client Jarvis.

## 12.1 — Skill Fathom vers compte-rendu client

Statut : COMPLETE
Objectif :
Créer le skill qui relie Fathom à Jarvis pour transformer un appel enregistré
en compte-rendu structuré et mise à jour du dossier client.

Action attendue :
Construire un skill capable de :
- récupérer une transcription et un résumé Fathom via URL ou call ID (MCP Fathom) ;
- passer le contenu à meeting-intelligence pour analyse structurée ;
- proposer la mise à jour du dossier client (actions, décisions, statut, historique) ;
- rester dans une logique d'assistance et de validation humaine (aucune écriture automatique).

Destination cible :
.claude/skills/

Fichier cible :
.claude/skills/fathom-compte-rendu-client/SKILL.md

Critère de validation :
Le fichier SKILL.md existe dans .claude/skills/fathom-compte-rendu-client/,
respecte le format canonique des skills du workspace, définit clairement
son rôle, ses déclencheurs et son fonctionnement avec le MCP Fathom,
et passe une revue humaine.

Dépendances :
LOT 11 COMPLETE

Autorisation humaine : APPROVED
