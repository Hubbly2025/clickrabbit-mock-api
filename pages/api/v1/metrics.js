const { faker } = require('@faker-js/faker');

// Generate time series data for the last 30 days
function generateTimeSeries(baseValue, variance = 0.2) {
  const data = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Add some realistic variance with weekly patterns
    const weekdayMultiplier = date.getDay() === 0 || date.getDay() === 6 ? 0.7 : 1;
    const randomVariance = 1 + (Math.random() - 0.5) * variance;
    const value = Math.round(baseValue * weekdayMultiplier * randomVariance);
    
    data.push([dateStr, value]);
  }
  
  return data;
}

// Mock KPI data
function getMockMetrics() {
  const visitors = 43256;
  const resolvedRate = 0.62;
  const leadsPerDay = Math.round(visitors * resolvedRate * 0.12 / 30); // ~12% of resolved become leads
  
  return {
    visitors,
    resolved_rate: resolvedRate,
    leads_captured: Math.round(leadsPerDay * 30),
    enrichment_completion: 0.74,
    top_sources: [
      { source: 'google', pct: 0.41 },
      { source: 'linkedin', pct: 0.22 },
      { source: 'direct', pct: 0.19 },
      { source: 'facebook', pct: 0.12 },
      { source: 'twitter', pct: 0.06 }
    ],
    series: {
      visitors: generateTimeSeries(visitors / 30, 0.3),
      resolved: generateTimeSeries(Math.round(visitors * resolvedRate / 30), 0.25),
      leads: generateTimeSeries(leadsPerDay, 0.4)
    },
    funnel: {
      visitors,
      resolved: Math.round(visitors * resolvedRate),
      enriched: Math.round(visitors * resolvedRate * 0.74),
      activated: Math.round(visitors * resolvedRate * 0.74 * 0.76)
    }
  };
}

// Next.js API handler
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const metrics = getMockMetrics();
      res.status(200).json(metrics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate metrics' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
