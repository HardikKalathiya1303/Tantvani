import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, MapPin, Clock, ArrowLeft, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import { useAuthStore } from '../store/useAuthStore';

const STEPS = [
  { key: 'pending',    label: 'Order Placed',    Icon: Package },
  { key: 'confirmed',  label: 'Confirmed',        Icon: CheckCircle },
  { key: 'processing', label: 'Processing',       Icon: Clock },
  { key: 'shipped',    label: 'Shipped',          Icon: Truck },
  { key: 'delivered',  label: 'Delivered',        Icon: MapPin },
];

const STATUS_INDEX = { pending: 0, confirmed: 1, processing: 2, shipped: 3, delivered: 4 };

export default function TrackOrderPage() {
  const { id } = useParams();
  const user = useAuthStore(s => s.user);

  const { data: orderData, isLoading: loadingOrder } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get(`/orders/${id}`).then(r => r.data),
    enabled: !!id && !!user,
  });

  const { data: trackData, isLoading: loadingTrack } = useQuery({
    queryKey: ['track', id],
    queryFn: () => api.get(`/orders/${id}/track`).then(r => r.data),
    enabled: !!id && !!user,
    refetchInterval: 5 * 60 * 1000,
  });

  const order = orderData?.order;
  const currentStep = STATUS_INDEX[order?.orderStatus] ?? 0;
  const isCancelled = order?.orderStatus === 'cancelled';

  const activities = trackData?.tracking?.tracking_data?.shipment_track_activities || [];
  const trackInfo = trackData?.tracking?.tracking_data?.shipment_track?.[0];

  if (!user) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center">
          <p className="font-cormorant text-2xl text-wine-dark mb-4">Please login to track your order</p>
          <Link to="/login" className="btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  if (loadingOrder) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold/30 border-t-wine rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center">
          <p className="font-cormorant text-2xl text-wine-dark mb-4">Order not found</p>
          <Link to="/account" className="btn-primary">My Orders</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <Link to="/account" className="inline-flex items-center gap-2 font-jost text-xs tracking-widest uppercase text-wine-dark/60 hover:text-wine mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="font-jost text-[10px] tracking-[0.3em] uppercase text-gold mb-1">Order Tracking</p>
          <h1 className="font-cormorant text-3xl sm:text-4xl text-wine-dark">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="font-karla text-sm text-wine-dark/50 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </motion.div>

        {/* Cancelled state */}
        {isCancelled ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 flex gap-4">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-jost font-bold text-red-700 text-sm">Order Cancelled</p>
              {order.cancellationReason && <p className="font-karla text-sm text-red-600 mt-1">Reason: {order.cancellationReason}</p>}
              {order.cancelledAt && <p className="font-karla text-xs text-red-500 mt-1">on {new Date(order.cancelledAt).toLocaleDateString('en-IN')}</p>}
            </div>
          </motion.div>
        ) : (
          /* Progress stepper */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-wine-dark/10 p-6 sm:p-8 mb-6">
            <h2 className="font-jost text-xs tracking-[0.25em] uppercase text-wine-dark mb-8">Shipment Progress</h2>
            <div className="relative">
              {/* Progress line */}
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-cream-darker/30 hidden sm:block" />
              <div
                className="absolute top-5 left-5 h-0.5 bg-wine hidden sm:block transition-all duration-700"
                style={{ width: `${(currentStep / (STEPS.length - 1)) * 90}%` }}
              />
              <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-0 relative z-10">
                {STEPS.map((step, i) => {
                  const done = i <= currentStep;
                  const active = i === currentStep;
                  return (
                    <div key={step.key} className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2 sm:flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-500 ${done ? 'bg-wine border-wine text-cream-light' : 'bg-white border-cream-darker/30 text-wine-dark/30'} ${active ? 'shadow-lg shadow-wine/20 scale-110' : ''}`}>
                        <step.Icon className="w-4 h-4" />
                      </div>
                      <p className={`font-jost text-[10px] tracking-wider uppercase text-center ${done ? 'text-wine-dark' : 'text-wine-dark/30'}`}>{step.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Courier info */}
        {(order.awbCode || order.courierName) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-wine-dark/10 p-6 mb-6">
            <h2 className="font-jost text-xs tracking-[0.25em] uppercase text-wine-dark mb-4">Courier Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {order.courierName && (
                <div>
                  <p className="font-jost text-[10px] tracking-widest uppercase text-wine-dark/40 mb-1">Courier</p>
                  <p className="font-karla text-sm font-semibold text-wine-dark">{order.courierName}</p>
                </div>
              )}
              {order.awbCode && (
                <div>
                  <p className="font-jost text-[10px] tracking-widest uppercase text-wine-dark/40 mb-1">AWB / Tracking No.</p>
                  <p className="font-karla text-sm font-semibold text-wine-dark font-mono">{order.awbCode}</p>
                </div>
              )}
              {trackInfo?.edd && (
                <div>
                  <p className="font-jost text-[10px] tracking-widest uppercase text-wine-dark/40 mb-1">Est. Delivery</p>
                  <p className="font-karla text-sm font-semibold text-wine-dark">{new Date(trackInfo.edd).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</p>
                </div>
              )}
              {trackInfo?.current_status && (
                <div>
                  <p className="font-jost text-[10px] tracking-widest uppercase text-wine-dark/40 mb-1">Current Status</p>
                  <p className="font-karla text-sm font-semibold text-wine">{trackInfo.current_status}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Activity timeline */}
        {activities.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl border border-wine-dark/10 p-6 mb-6">
            <h2 className="font-jost text-xs tracking-[0.25em] uppercase text-wine-dark mb-6">Tracking Timeline</h2>
            <div className="space-y-4">
              {activities.map((act, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1 ${i === 0 ? 'bg-wine' : 'bg-cream-darker/40'}`} />
                    {i < activities.length - 1 && <div className="w-px flex-1 bg-cream-darker/20 mt-1" />}
                  </div>
                  <div className="pb-4">
                    <p className="font-karla text-sm text-wine-dark font-medium">{act.activity}</p>
                    {act.location && <p className="font-karla text-xs text-wine-dark/50 mt-0.5">{act.location}</p>}
                    <p className="font-karla text-xs text-wine-dark/40 mt-0.5">{act.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* No tracking yet */}
        {!loadingTrack && !order.awbCode && !isCancelled && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex gap-3">
            <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="font-karla text-sm text-amber-700">Your shipment is being prepared. Tracking details will appear once your order is dispatched.</p>
          </div>
        )}

        {/* Order items */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl border border-wine-dark/10 p-6">
          <h2 className="font-jost text-xs tracking-[0.25em] uppercase text-wine-dark mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.orderItems.map((item, i) => (
              <div key={i} className="flex gap-4">
                {item.image && <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-lg shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="font-karla text-sm font-medium text-wine-dark truncate">{item.name}</p>
                  <p className="font-karla text-xs text-wine-dark/50 mt-0.5">Qty: {item.quantity}</p>
                  <p className="font-karla text-sm text-wine-dark mt-1">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-cream-darker/20 space-y-1.5">
            <div className="flex justify-between font-karla text-sm text-wine-dark/60">
              <span>Subtotal</span><span>₹{order.itemsPrice?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between font-karla text-sm text-wine-dark/60">
              <span>Shipping</span><span>{order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice}`}</span>
            </div>
            <div className="flex justify-between font-karla text-sm font-bold text-wine-dark pt-1 border-t border-cream-darker/20">
              <span>Total</span><span>₹{order.totalPrice?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
