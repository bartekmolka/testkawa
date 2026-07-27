const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export async function initiatePayUPayment(orderDetails) {
  const response = await fetch(`${BACKEND_URL}/api/payu/test-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderDetails),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Wystąpił błąd podczas płatności.');
  }

  return data;
}