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

Statut : TODO
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

Statut : TODO
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
