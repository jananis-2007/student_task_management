const express = require('express');
const router = express.Router();
const { checkDbConnection } = require('../config/db');

/**
 * @route   GET /api/health
 * @desc    Health-check endpoint to test server and database status
 * @access  Public
 */
router.get('/', async (req, res) => {
  const dbStatus = await checkDbConnection();

  const healthData = {
    status: 'ok',
    service: 'Student Task Management API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: {
      type: 'SQLite',
      status: dbStatus.connected ? 'connected' : 'disconnected',
      details: dbStatus.message || dbStatus.error,
    },
  };

  const statusCode = dbStatus.connected ? 200 : 503;
  res.status(statusCode).json(healthData);
});

module.exports = router;
