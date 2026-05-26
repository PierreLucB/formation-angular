// Créez une interface utilisateur
export interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  age?: number;
}

// Créez un type pour un tableau d'utilisateurs
export type ListeUtilisateurs = Utilisateur[];

// Créez une fonction typée
export function afficherUtilisateur(user: Utilisateur): string {
  return `${user.nom} (${user.email})`;
}

// Utilisez-les
const users: ListeUtilisateurs = [
  { id: 1, nom: 'Alice', email: 'alice@mail.com', age: 30 },
  { id: 2, nom: 'Bob', email: 'bob@mail.com' }
];

users.forEach(user => {
  console.log(afficherUtilisateur(user));
});
