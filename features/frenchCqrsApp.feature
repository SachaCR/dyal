#language: fr
Fonctionnalité: Éxécuter une action avec une application CQRS
  Utiliser le bon controlleur pour éxécuter une commande ou une requête.

  Plan du scénario: Éxécuter une action avec une application CQRS
    Soit une application CQRS
    Et des controlleurs ont été enregistré pour les commandes de types A, B, C
    Et des controlleurs ont été enregistré pour les requêtes de types D, E ,F
    Quand j'éxécute une "<actionType>" de type "<actionName>"
    Alors je dois recevoir le resultat suivant: "<result>"

  Exemples:
    | actionType      | actionName  | result        |
    | command     | CommandA    | A             |
    | command     | CommandB    | B             |
    | command     | CommandC    | C             |
    | command     | CommandD    | RangeError    |    
    | query       | QueryD      | D             |
    | query       | QueryE      | E             |
    | query       | QueryF      | F             |
    | query       | QueryG      | RangeError    |