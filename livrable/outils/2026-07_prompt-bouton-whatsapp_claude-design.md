# Prompt : bouton WhatsApp flottant (MVP Pilotage BTP)

> Prompt à coller dans Claude Design (claude.ai/design), dans la même
> conversation que les écrans déjà générés, pour ajouter un élément
> transversal (visible sur tous les écrans) plutôt qu'un nouvel écran.

---

## Pourquoi ce bouton

Public cible = patrons BTP peu à l'aise avec la tech, qui utilisent déjà
WhatsApp couramment pour leur activité. Un accès direct au support par
WhatsApp (plutôt qu'un formulaire ou un email) réduit la friction pour
poser une question rapide. Ce n'est pas un contact par client/organisation,
c'est un canal de support unique vers l'équipe Pilotage BTP.

---

## Prompt

Ajoute un **bouton flottant WhatsApp**, présent sur tous les écrans déjà
générés (Dashboard, Clients, Chantiers, Devis), en plus de ce qui existe
déjà (ne remplace aucun élément).

--- SPÉCIFICATIONS ---

1. **Position** : fixe en bas à droite de l'écran (`position: fixed`,
   ~24px des bords), toujours visible même en scrollant, par-dessus le
   contenu (z-index élevé). Reste bien positionné sur mobile (la sidebar
   devient un menu hamburger sur mobile, il n'y a pas de barre de
   navigation basse qui entrerait en conflit avec ce bouton).

2. **Apparence** : bouton rond (~56px de diamètre), fond vert WhatsApp
   standard `#25D366` (volontairement hors de la charte navy/orange du
   reste de l'appli, pour rester immédiatement reconnaissable comme un
   contact WhatsApp), icône du logo WhatsApp en blanc au centre, ombre
   portée discrète pour le détacher du contenu.

3. **Interaction** :
   - Au survol (desktop) : légère mise à l'échelle (scale ~1.05) + une
     bulle tooltip qui apparaît à gauche du bouton avec le texte "Besoin
     d'aide ? Discutons sur WhatsApp".
   - Au clic : ouvre un nouvel onglet vers
     `https://wa.me/33762008619?text=Bonjour%2C%20j%27ai%20besoin%20d%27aide%20sur%20Pilotage%20BTP`
     (numéro de support + message pré-rempli).

4. Génère ce bouton sur au moins deux écrans déjà existants (ex. Dashboard
   et Chantiers) pour vérifier qu'il ne chevauche aucun élément existant
   (notamment pas de conflit avec un bouton d'action en bas de page sur
   mobile).

--- LIVRABLE ATTENDU ---
Code HTML/CSS du bouton (classe nommée, ex. `.whatsapp-float-button`),
positionné par-dessus le markup des écrans existants, responsive.

---

## Rappel workflow d'intégration

Une fois généré : à la migration en code (déclenchée par Christophe quand
il sera prêt), ce sera un composant client unique
`src/components/layout/whatsapp-button.tsx` (lien statique, pas de logique
serveur), monté une fois dans le layout de l'appli
(`src/app/(app)/layout.tsx`) pour apparaître automatiquement sur toutes les
pages protégées, plutôt que dupliqué sur chaque écran.
