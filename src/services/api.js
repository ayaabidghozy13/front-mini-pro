const API_URL = 'https://apipharmacie.pecatte.fr/api/4/medicaments';

export async function getMedicaments() {
  const reponse = await fetch(API_URL);
  return reponse.json();
}

export async function ajouterMedicament(medicament) {
  const reponse = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(medicament)
  });
  return reponse.json();
}

export async function supprimerMedicament(id) {
  await fetch(`${API_URL}/${id}`, { 
    method: 'DELETE' 
  });
}

export async function modifierMedicament(medicament) {
  const reponse = await fetch(API_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(medicament)
  });
  return reponse.json();
}