const axios = require('axios');

const BASE = 'https://apiv2.shiprocket.in/v1/external';

let cachedToken = null;
let tokenExpiry = null;

async function getToken() {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }
  const { data } = await axios.post(`${BASE}/auth/login`, {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  });
  cachedToken = data.token;
  // Token valid for 24h, refresh after 23h
  tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
  return cachedToken;
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

async function createShiprocketOrder(order) {
  const token = await getToken();
  const addr = order.shippingAddress;

  const totalWeight = order.orderItems.reduce((sum, item) => sum + (item.quantity * 0.5), 0); // 500g per saree

  const payload = {
    order_id: order._id.toString(),
    order_date: new Date(order.createdAt).toISOString().slice(0, 19),
    pickup_location: 'Primary',
    billing_customer_name: addr.name,
    billing_last_name: '',
    billing_address: `${addr.houseNo || ''} ${addr.street}`.trim(),
    billing_address_2: addr.landmark || '',
    billing_city: addr.city,
    billing_pincode: addr.pincode,
    billing_state: addr.state,
    billing_country: addr.country || 'India',
    billing_email: addr.email || '',
    billing_phone: addr.phone,
    shipping_is_billing: true,
    order_items: order.orderItems.map(item => ({
      name: item.name,
      sku: item.product?.toString() || item.name,
      units: item.quantity,
      selling_price: item.price,
    })),
    payment_method: order.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
    sub_total: order.itemsPrice,
    length: 30,
    breadth: 25,
    height: 5,
    weight: Math.max(totalWeight, 0.5),
  };

  const { data } = await axios.post(`${BASE}/orders/create/adhoc`, payload, {
    headers: authHeaders(token),
  });
  return data;
}

async function generateAWB(shipmentId) {
  const token = await getToken();
  const { data } = await axios.post(`${BASE}/courier/assign/awb`, {
    shipment_id: [shipmentId],
  }, { headers: authHeaders(token) });
  return data;
}

async function requestPickup(shipmentId) {
  const token = await getToken();
  const { data } = await axios.post(`${BASE}/courier/generate/pickup`, {
    shipment_id: [shipmentId],
  }, { headers: authHeaders(token) });
  return data;
}

async function trackShipment(awbCode) {
  const token = await getToken();
  const { data } = await axios.get(`${BASE}/courier/track/awb/${awbCode}`, {
    headers: authHeaders(token),
  });
  return data;
}

async function cancelShiprocketOrder(shiprocketOrderIds) {
  const token = await getToken();
  const { data } = await axios.post(`${BASE}/orders/cancel`, {
    ids: shiprocketOrderIds,
  }, { headers: authHeaders(token) });
  return data;
}

module.exports = { createShiprocketOrder, generateAWB, requestPickup, trackShipment, cancelShiprocketOrder };
