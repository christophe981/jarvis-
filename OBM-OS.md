# OBM-OS

## Rôle du système

OBM-OS est le système d'organisation et d'assistance IA de Christophe Lachaud pour son activité d'Online Business Manager.
Il complète Jarvis, mais ne le remplace pas.

* `CLAUDE.md` définit qui est Christophe, ses objectifs, ses préférences et les règles générales.
* Les sous-agents définissent les spécialistes chargés de missions précises.
* Les Skills définissent des savoir-faire réutilisables.
* Knowledge contient les connaissances, formations et méthodes de référence.
* Templates contient les documents modèles à personnaliser.
* SOP contient les procédures de travail.
* Clients contient le contexte propre à chaque client.
* Labs contient les idées, essais et éléments encore non validés.

## Principes de fonctionnement

Claude doit privilégier :

1. La simplicité.
2. La clarté.
3. La fiabilité.
4. La documentation.
5. La réutilisation.
6. Les solutions évolutives.
7. L'automatisation lorsqu'elle apporte un bénéfice réel.
8. Le contrôle humain pour les décisions importantes.

Claude ne doit pas créer une architecture complexe lorsqu'une solution simple suffit.
Claude doit distinguer clairement les connaissances, les modèles, les procédures et les compétences.

## Les composants

### Jarvis

Jarvis correspond au contexte central contenu principalement dans `CLAUDE.md` et `context/`.
Il connaît Christophe, son parcours, ses objectifs, son activité, ses préférences et ses projets.
Jarvis ne doit pas devenir une bibliothèque contenant tous les documents de l'entreprise. Il reste synthétique et oriente Claude vers les ressources appropriées.

### Sous-agents

Les sous-agents seront créés progressivement dans `.claude/agents/`.
Les cinq sous-agents prévus sont :

* `operations`, pour l'organisation, la coordination, les procédures, les roadmaps et le suivi des missions ;
* `sales`, pour la prospection, les interviews, les appels stratégiques, les offres et les relances ;
* `marketing`, pour LinkedIn, Instagram, les contenus, le positionnement et la communication ;
* `automation`, pour n8n, Airtable, les API, les MCP et les automatisations ;
* `business`, pour les objectifs, les indicateurs, les décisions, la rentabilité et le développement de l'activité.

Ces agents ne doivent pas encore être créés ou remplis sans instruction complémentaire.

### Skills

Les Skills sont des compétences réutilisables enregistrées dans `.claude/skills/`.
Un Skill explique comment accomplir correctement une tâche précise. Il peut contenir des instructions, des exemples, des ressources ou des scripts.
Exemples de Skills futurs :

* analyser une transcription Fathom ;
* créer une SOP ;
* produire une roadmap ;
* préparer une restitution d'interview ;
* concevoir un workflow n8n ;
* structurer une base Airtable ;
* transformer une méthode OBM Elite en processus opérationnel.

Un document modèle ne doit pas devenir automatiquement un Skill.

### Knowledge

`knowledge/` contient les connaissances que Claude peut consulter pour comprendre une méthode ou un domaine.
Exemples :

* notes de formation OBM Elite ;
* méthodologies commerciales ;
* principes de gestion de projet ;
* documentation sur les outils ;
* bonnes pratiques d'automatisation.

Une connaissance explique un sujet, mais ne constitue pas nécessairement une procédure à suivre.

### Templates

`templates/` contient les structures de documents à compléter ou à adapter.
Exemples :

* messages de prospection ;
* questionnaires d'interview ;
* offres intensives ;
* roadmaps ;
* restitutions ;
* documents win-win ;
* documents d'onboarding ;
* emails et messages clients.

Chaque modèle doit être rangé dans la catégorie correspondant à son usage.

### SOP

`SOP` signifie procédure opérationnelle standard.
`sop/` contient les étapes à suivre pour réaliser un processus de façon régulière et reproductible.
Exemples :

* préparer un appel stratégique ;
* intégrer un nouveau client ;
* analyser une transcription ;
* produire une restitution ;
* mettre à jour une roadmap ;
* clôturer une mission.

### Clients

`clients/` contient un dossier séparé pour chaque client actif.
Chaque dossier client pourra contenir :

* `CLIENT.md`, contexte général du client ;
* `objectifs.md` ;
* `contacts.md` ;
* `outils.md` ;
* `decisions.md` ;
* `roadmap.md` ;
* `reunions/` ;
* `livrables/`.

Le dossier `_modele-client/` servira de modèle. Aucun client ne doit être ajouté automatiquement sans une instruction explicite de Christophe.

### Labs

`labs/` contient les idées, tests, brouillons et expérimentations qui ne font pas encore partie du système validé.
Un élément ne doit quitter Labs que lorsqu'il a été vérifié, organisé et approuvé.

## Règle de classement

Avant d'enregistrer une nouvelle ressource, Claude doit déterminer sa nature :

* Information personnelle ou stratégique sur Christophe : `context/`
* Connaissance ou contenu de formation : `knowledge/`
* Document à remplir ou personnaliser : `templates/`
* Étapes d'un processus : `sop/`
* Savoir-faire spécialisé et réutilisable : `.claude/skills/`
* Instructions d'un spécialiste IA : `.claude/agents/`
* Informations propres à une entreprise accompagnée : `clients/`
* Idée ou expérimentation non validée : `labs/`

Si une ressource combine plusieurs catégories, Claude doit conserver la source originale dans Knowledge ou dans `context/import/`, puis créer séparément les ressources opérationnelles nécessaires.

## Protection des informations

Claude ne doit jamais mélanger les informations confidentielles de plusieurs clients.
Un Skill peut être réutilisé pour plusieurs clients, mais il ne doit pas contenir leurs données personnelles ou confidentielles.
Les informations propres à un client restent dans son dossier.

## Évolution du système

OBM-OS doit être construit progressivement.
Ordre de développement recommandé :

1. Architecture générale.
2. Agent Operations.
3. Agent Sales.
4. Premiers templates OBM Elite.
5. Premières SOP.
6. Skills réellement nécessaires.
7. Agent Marketing.
8. Agent Automation.
9. Agent Business.
10. Connexions avec les outils externes.

Ne crée pas toutes les briques en même temps.
