// src/services/medicineService.js
const API_BASE = "https://apipharmacie.pecatte.fr/api/1/medicaments";

export const medicineService = {
  async getAll() {
    const res = await fetch(API_BASE);
    return res.json();
  },
  
  async save(medicine, isEditing) {
    const method = isEditing ? 'PUT' : 'POST';
    // Note: The specific API you are using often expects PUT to the base URL 
    // with the ID inside the JSON body, or to /id. Check your documentation!
    const res = await fetch(API_BASE, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medicine)
    });
    return res.json();
  },

  async delete(id) {
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  },

  async updateQuantity(medicine, newQty) {
    const updated = { ...medicine, qte: newQty };
    return this.save(updated, true);
  }
};