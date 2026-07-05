-- Stripe peut renvoyer d'autres statuts d'abonnement que ceux prevus initialement.
alter type subscription_status add value if not exists 'incomplete_expired';
alter type subscription_status add value if not exists 'paused';
