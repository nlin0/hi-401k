const API_BASE = "/api";

// GET current contribution
export async function fetchContribution() {
  const res = await fetch(`${API_BASE}/contribution`);
  return res.json();
}

// SAVE updated contribution
export async function saveContribution(data) {
  const res = await fetch(`${API_BASE}/contribution`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// GET mock YTD data
export async function fetchYTD() {
  const res = await fetch(`${API_BASE}/ytd`);
  return res.json();
}
