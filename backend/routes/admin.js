const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');

router.use(protect, adminOnly);

router.get('/users', async (req, res) => {
  const users = await User.find({ role: 'user' }).sort('-createdAt');
  res.json({ success: true, users });
});

router.put('/users/:id/role', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
  res.json({ success: true, user });
});

router.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'User deleted' });
});

router.get('/stats', async (req, res) => {
  const [totalProducts, totalOrders, totalUsers, totalCategories] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    User.countDocuments({ role: 'user' }),
    Category.countDocuments(),
  ]);

  const revenueResult = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);

  const monthlyRevenue = await Order.aggregate([
    { $match: { isPaid: true, createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const topProducts = await Product.find().sort('-soldCount').limit(5).select('name soldCount price images');

  res.json({
    success: true,
    stats: {
      totalProducts,
      totalOrders,
      totalUsers,
      totalCategories,
      totalRevenue: revenueResult[0]?.total || 0,
      monthlyRevenue,
      topProducts,
    },
  });
});

router.get('/analytics', async (req, res) => {
  try {
    const { range = '30d' } = req.query; // '7d', '30d', '90d', '1y', 'all'
    
    let dateFilter = {};
    if (range === '7d') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
    } else if (range === '30d') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
    } else if (range === '90d') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } };
    } else if (range === '1y') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } };
    }

    // 1. Order Status breakdown
    const statusCounts = await Order.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$orderStatus', count: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } }
    ]);

    // 2. Payment Method distribution
    const paymentDistribution = await Order.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$paymentMethod', count: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } }
    ]);

    // 3. Paid vs Unpaid breakdown
    const paymentStatus = await Order.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$isPaid', count: { $sum: 1 }, total: { $sum: '$totalPrice' } } }
    ]);

    // 4. Sales Trends (daily or monthly depending on range)
    const salesTrend = await Order.aggregate([
      { $match: { ...dateFilter, isPaid: true } },
      {
        $group: {
          _id: {
            $dateToString: { format: range === '1y' || range === 'all' ? '%Y-%m' : '%Y-%m-%d', date: '$createdAt' }
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // 5. Inventory Health
    const [inStockCount, lowStockCount, outOfStockCount] = await Promise.all([
      Product.countDocuments({ stock: { $gt: 5 } }),
      Product.countDocuments({ stock: { $gt: 0, $lte: 5 } }),
      Product.countDocuments({ stock: { $lte: 0 } }),
    ]);

    // 6. Category Performance
    const categorySales = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          productCount: { $sum: 1 },
          totalSold: { $sum: '$soldCount' },
          totalStock: { $sum: '$stock' }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'catDetails'
        }
      },
      { $unwind: { path: '$catDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: { $ifNull: ['$catDetails.name', 'Uncategorized'] },
          productCount: 1,
          totalSold: 1,
          totalStock: 1
        }
      },
      { $sort: { totalSold: -1 } }
    ]);

    // 7. Overall Business KPIs
    const allOrdersInPeriod = await Order.find(dateFilter).select('totalPrice orderStatus isPaid user');
    const totalOrders = allOrdersInPeriod.length;
    const paidOrders = allOrdersInPeriod.filter(o => o.isPaid);
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const avgOrderValue = paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0;
    const deliveredOrders = allOrdersInPeriod.filter(o => o.orderStatus === 'delivered').length;
    const cancelledOrders = allOrdersInPeriod.filter(o => o.orderStatus === 'cancelled').length;
    const fulfillmentRate = totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100).toFixed(1) : '100.0';
    const cancellationRate = totalOrders > 0 ? ((cancelledOrders / totalOrders) * 100).toFixed(1) : '0.0';

    const uniqueCustomerIds = new Set(allOrdersInPeriod.map(o => o.user?.toString()).filter(Boolean));

    // 8. Top Selling Sarees (Future focus: High demand products)
    const topProductsRaw = await Product.find()
      .populate('category', 'name')
      .sort('-soldCount -rating')
      .limit(10)
      .select('name sku price discountPrice stock soldCount images fabric rating category isBestseller isFeatured');

    const topSellingSarees = topProductsRaw.map(p => {
      const activePrice = p.discountPrice || p.price;
      const totalGenerated = (p.soldCount || 0) * activePrice;

      let demandBadge = 'HEALTHY';
      let demandAdvice = 'Consistent sales, maintain balanced stock.';

      if (p.stock <= 0) {
        demandBadge = 'OUT_OF_STOCK';
        demandAdvice = 'High customer demand but out of stock! Restock urgently.';
      } else if (p.stock <= 3 && p.soldCount > 0) {
        demandBadge = 'RESTOCK_URGENT';
        demandAdvice = `Selling fast (${p.soldCount} sold), only ${p.stock} units remaining. Place reorder soon!`;
      } else if (p.soldCount >= 5) {
        demandBadge = 'HERO_PRODUCT';
        demandAdvice = 'Bestseller saree! Focus digital ads and feature prominently on home page.';
      }

      return {
        _id: p._id,
        name: p.name,
        sku: p.sku || 'SKU —',
        categoryName: p.category?.name || 'Sarees',
        image: p.images?.[0]?.url || '',
        price: p.price,
        discountPrice: p.discountPrice,
        stock: p.stock,
        soldCount: p.soldCount || 0,
        fabric: p.fabric || 'Pure Silk',
        rating: p.rating || 5,
        totalRevenue: totalGenerated,
        demandBadge,
        demandAdvice
      };
    });

    // 9. Fabric Demand Velocity (Which fabric should admin stock more of)
    const fabricVelocity = await Product.aggregate([
      { $match: { fabric: { $exists: true, $ne: '' } } },
      {
        $group: {
          _id: '$fabric',
          totalSold: { $sum: '$soldCount' },
          productCount: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { totalSold: -1, totalStock: -1 } },
      { $limit: 8 }
    ]);

    // 11. Color Demand Trends (Which colors customers prefer)
    const colorDemand = await Product.aggregate([
      { $unwind: '$color' },
      { $match: { color: { $exists: true, $ne: '' } } },
      {
        $group: {
          _id: { $toLower: '$color' },
          totalSold: { $sum: '$soldCount' },
          productCount: { $sum: 1 }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 8 }
    ]);

    // 12. Price Band Analysis (Where sales volume is concentrated)
    const priceBands = [
      { band: 'Under ₹3,000', min: 0, max: 3000 },
      { band: '₹3,000 - ₹6,000', min: 3000, max: 6000 },
      { band: '₹6,000 - ₹12,000', min: 6000, max: 12000 },
      { band: 'Above ₹12,000', min: 12000, max: 1000000 },
    ];

    const priceBandStats = await Promise.all(
      priceBands.map(async b => {
        const stats = await Product.aggregate([
          { $match: { price: { $gte: b.min, $lt: b.max } } },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              totalSold: { $sum: '$soldCount' },
              totalStock: { $sum: '$stock' }
            }
          }
        ]);
        return {
          band: b.band,
          productsCount: stats[0]?.count || 0,
          totalSold: stats[0]?.totalSold || 0,
          totalStock: stats[0]?.totalStock || 0
        };
      })
    );

    res.json({
      success: true,
      analytics: {
        range,
        totalOrders,
        totalRevenue,
        avgOrderValue,
        fulfillmentRate,
        cancellationRate,
        activeCustomers: uniqueCustomerIds.size,
        statusCounts,
        paymentDistribution,
        paymentStatus,
        salesTrend,
        inventoryHealth: {
          inStock: inStockCount,
          lowStock: lowStockCount,
          outOfStock: outOfStockCount,
          total: inStockCount + lowStockCount + outOfStockCount
        },
        categorySales,
        topSellingSarees,
        fabricVelocity,
        colorDemand,
        priceBandStats
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
