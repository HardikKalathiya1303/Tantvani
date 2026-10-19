/**
 * Google Analytics 4 (GA4) Helper Utilities
 * Measurement ID: G-55XXZ5E72R
 */

export const GA_MEASUREMENT_ID = 'G-55XXZ5E72R';

/**
 * Safely dispatch a custom event to Google Analytics via gtag
 * @param {string} action - Event name (e.g. 'add_to_cart', 'purchase', 'login')
 * @param {object} params - Event parameters
 */
export const trackEvent = (action, params = {}) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, params);
  }
  // Tag session recording in Microsoft Clarity
  if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
    window.clarity('event', action);
  }
};

/**
 * Identify user in Microsoft Clarity & Google Analytics
 * Links all session recordings, heatmaps, and analytics events to this specific user ID & name
 * @param {object} user
 */
export const identifyUser = (user) => {
  if (!user) return;
  const userId = String(user._id || user.id || '');
  const userName = user.name || 'Customer';

  // 1. Identify in Microsoft Clarity
  // Official Clarity API: clarity("identify", customId, customSessionId, customPageId, friendlyName)
  if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
    window.clarity('identify', userId, undefined, undefined, userName);
    if (user.email) window.clarity('set', 'user_email', user.email);
    if (user.phone) window.clarity('set', 'user_phone', user.phone);
  }

  // 2. Identify in Google Analytics 4
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('set', 'user_properties', {
      user_id: userId,
      user_name: userName,
    });
    window.gtag('config', GA_MEASUREMENT_ID, {
      user_id: userId,
    });
  }
};

/**
 * Initialize Rage Click auto-detection globally
 * Detects if a user taps/clicks any element >= 3 times in 800ms (unresponsive button / frustration)
 */
export const initRageClickDetection = () => {
  if (typeof window === 'undefined') return;

  let clickCount = 0;
  let lastTarget = null;
  let timer = null;

  window.addEventListener(
    'click',
    (e) => {
      const target = e.target?.closest('button, a, input, select, [role="button"]') || e.target;
      if (!target) return;

      if (target === lastTarget) {
        clickCount++;
      } else {
        lastTarget = target;
        clickCount = 1;
      }

      clearTimeout(timer);

      if (clickCount >= 3) {
        const buttonLabel = target.innerText?.trim()?.slice(0, 40) || target.getAttribute('aria-label') || target.tagName;
        trackEvent('rage_click', {
          element_text: buttonLabel,
          element_tag: target.tagName,
          page_path: window.location.pathname,
          clicks: clickCount,
        });
        clickCount = 0;
      } else {
        timer = setTimeout(() => {
          clickCount = 0;
          lastTarget = null;
        }, 800);
      }
    },
    { passive: true }
  );
};

/**
 * Track user viewing an item
 * @param {object} product
 */
export const trackViewItem = (product) => {
  if (!product) return;
  const categoryName = typeof product.category === 'object' ? product.category?.name : (product.category || product.fabric || 'Sarees');
  const price = product.discountPrice || product.price || 0;
  trackEvent('view_item', {
    currency: 'INR',
    value: price,
    items: [
      {
        item_id: String(product._id || product.id || ''),
        item_name: product.name,
        price,
        item_category: categoryName,
      },
    ],
  });
};

/**
 * Track user tapping/clicking on a product card
 * @param {object} product
 * @param {string} listName
 */
export const trackSelectItem = (product, listName = 'Product Grid') => {
  if (!product) return;
  const categoryName = typeof product.category === 'object' ? product.category?.name : (product.category || product.fabric || 'Sarees');
  const price = product.discountPrice || product.price || 0;
  trackEvent('select_item', {
    item_list_name: listName,
    items: [
      {
        item_id: String(product._id || product.id || ''),
        item_name: product.name,
        price,
        item_category: categoryName,
      },
    ],
  });
};

/**
 * Track user adding an item to cart
 * @param {object} product
 * @param {number} quantity
 */
export const trackAddToCart = (product, quantity = 1) => {
  if (!product) return;
  trackEvent('add_to_cart', {
    currency: 'INR',
    value: (product.price || 0) * quantity,
    items: [
      {
        item_id: product._id || product.id,
        item_name: product.name,
        price: product.price || 0,
        quantity,
        item_category: product.category,
      },
    ],
  });
};

/**
 * Track user initiating checkout
 * @param {Array} items
 * @param {number} totalAmount
 */
export const trackBeginCheckout = (items = [], totalAmount = 0) => {
  trackEvent('begin_checkout', {
    currency: 'INR',
    value: totalAmount,
    items: items.map((item) => ({
      item_id: item._id || item.id,
      item_name: item.name,
      price: item.price || 0,
      quantity: item.quantity || 1,
    })),
  });
};

/**
 * Track purchase / successful payment
 * @param {object} order
 */
export const trackPurchase = (order) => {
  if (!order) return;
  trackEvent('purchase', {
    transaction_id: order._id || order.id || order.orderId,
    currency: 'INR',
    value: order.totalAmount || order.amount || 0,
    tax: order.tax || 0,
    shipping: order.shippingFee || 0,
    items: (order.items || []).map((item) => ({
      item_id: item.product?._id || item._id,
      item_name: item.product?.name || item.name,
      price: item.price || 0,
      quantity: item.quantity || 1,
    })),
  });
};

/**
 * Track user clicking/tapping on a category
 * @param {string} categoryName - Name of category (e.g. 'Banarasi Sarees')
 * @param {string} location - UI location (e.g. 'Home Featured', 'Navbar Dropdown', 'Mobile Menu')
 */
export const trackCategoryClick = (categoryName, location = 'Navigation') => {
  if (!categoryName) return;
  // Standard GA4 event
  trackEvent('select_content', {
    content_type: 'category',
    item_id: categoryName,
    category_name: categoryName,
    click_location: location,
  });
  // Dedicated custom event for instant visibility in GA4 Event reports
  trackEvent('category_click', {
    category_name: categoryName,
    click_location: location,
  });
};

/**
 * Track user viewing their shopping bag / cart
 * @param {Array} items
 * @param {number} subtotal
 */
export const trackViewCart = (items = [], subtotal = 0) => {
  trackEvent('view_cart', {
    currency: 'INR',
    value: subtotal,
    items: items.map((item) => ({
      item_id: String(item._id || item.id || ''),
      item_name: item.name,
      price: item.discountPrice || item.price || 0,
      quantity: item.quantity || 1,
    })),
  });
};

/**
 * Track user removing an item from cart
 * @param {object} item
 */
export const trackRemoveFromCart = (item) => {
  if (!item) return;
  trackEvent('remove_from_cart', {
    currency: 'INR',
    value: item.discountPrice || item.price || 0,
    items: [
      {
        item_id: String(item._id || item.id || ''),
        item_name: item.name,
        price: item.discountPrice || item.price || 0,
        quantity: item.quantity || 1,
      },
    ],
  });
};

/**
 * Track user completing shipping address step
 * @param {object} param0
 */
export const trackAddShippingInfo = ({ shippingTier = 'Standard', items = [], value = 0 }) => {
  trackEvent('add_shipping_info', {
    currency: 'INR',
    value,
    shipping_tier: shippingTier,
    items: items.map((item) => ({
      item_id: String(item._id || item.id || ''),
      item_name: item.name,
      price: item.discountPrice || item.price || 0,
      quantity: item.quantity || 1,
    })),
  });
};

/**
 * Track user selecting a payment method
 * @param {object} param0
 */
export const trackAddPaymentInfo = ({ paymentType = 'online', items = [], value = 0 }) => {
  trackEvent('add_payment_info', {
    currency: 'INR',
    value,
    payment_type: paymentType,
    items: items.map((item) => ({
      item_id: String(item._id || item.id || ''),
      item_name: item.name,
      price: item.discountPrice || item.price || 0,
      quantity: item.quantity || 1,
    })),
  });
};

/**
 * Track coupon code usage and failures (Identifies discount friction)
 * @param {object} param0
 */
export const trackCouponAttempt = ({ code, success, reason = '', orderValue = 0, discountAmount = 0 }) => {
  trackEvent(success ? 'coupon_applied' : 'coupon_failed', {
    coupon_code: code,
    success,
    failure_reason: reason,
    order_value: orderValue,
    discount_amount: discountAmount,
  });
};

/**
 * Track form validation errors (Pinpoints exact customer confusion)
 * @param {object} param0
 */
export const trackFormValidationError = ({ formName = 'checkout_shipping', field = '', errorMessage = '' }) => {
  trackEvent('form_validation_error', {
    form_name: formName,
    field_name: field,
    error_message: errorMessage,
  });
};

/**
 * Track payment cancellation (User opened Razorpay but closed without paying)
 * @param {object} param0
 */
export const trackPaymentCancelled = ({ paymentMethod = 'online', amount = 0 }) => {
  trackEvent('payment_cancelled', {
    payment_method: paymentMethod,
    amount,
  });
};

/**
 * Track payment failure
 * @param {object} param0
 */
export const trackPaymentFailed = ({ paymentMethod = 'online', amount = 0, reason = '' }) => {
  trackEvent('payment_failed', {
    payment_method: paymentMethod,
    amount,
    failure_reason: reason,
  });
};

/**
 * Track search queries and identify unmet demand (0 results)
 * @param {string} query
 * @param {number} resultsCount
 */
export const trackSearchQuery = (query, resultsCount = 0) => {
  if (!query) return;
  trackEvent('search', {
    search_term: query,
    results_count: resultsCount,
  });
  if (resultsCount === 0) {
    trackEvent('search_zero_results', {
      search_term: query,
    });
  }
};

/**
 * Track customer clicking WhatsApp stylist concierge for help
 * @param {object} product
 */
export const trackStylistInquiry = (product) => {
  trackEvent('contact_stylist_click', {
    product_id: product?._id || '',
    product_name: product?.name || '',
    product_price: product?.discountPrice || product?.price || 0,
  });
};


