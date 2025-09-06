// Mock data for enrichment providers/integrations
const mockIntegrations = [
  {
    id: 1,
    name: 'Apollo',
    type: 'Email Enrichment',
    status: 'connected',
    credits: 1250,
    match_rate: 85,
    last_sync: '2024-01-15T10:30:00Z',
    description: 'Professional email finder and contact database'
  },
  {
    id: 2,
    name: 'Hunter.io',
    type: 'Email Enrichment', 
    status: 'connected',
    credits: 890,
    match_rate: 78,
    last_sync: '2024-01-15T09:45:00Z',
    description: 'Find email addresses behind any website'
  },
  {
    id: 3,
    name: 'Clearbit',
    type: 'Company Enrichment',
    status: 'disconnected',
    credits: 0,
    match_rate: 0,
    last_sync: null,
    description: 'Company and person data enrichment'
  },
  {
    id: 4,
    name: 'ZoomInfo',
    type: 'B2B Database',
    status: 'connected',
    credits: 2100,
    match_rate: 92,
    last_sync: '2024-01-15T11:15:00Z',
    description: 'Comprehensive B2B contact and company database'
  },
  {
    id: 5,
    name: 'LinkedIn Sales Navigator',
    type: 'Social Enrichment',
    status: 'disconnected',
    credits: 0,
    match_rate: 0,
    last_sync: null,
    description: 'Professional networking and lead generation'
  },
  {
    id: 6,
    name: 'Snov.io',
    type: 'Email Finder',
    status: 'connected',
    credits: 567,
    match_rate: 73,
    last_sync: '2024-01-15T08:20:00Z',
    description: 'Email finder and verifier tool'
  }
];

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Handle filtering
    const { status, type } = req.query;
    
    let filteredIntegrations = [...mockIntegrations];
    
    if (status) {
      filteredIntegrations = filteredIntegrations.filter(
        integration => integration.status === status
      );
    }
    
    if (type) {
      filteredIntegrations = filteredIntegrations.filter(
        integration => integration.type.toLowerCase().includes(type.toLowerCase())
      );
    }

    // Calculate summary statistics
    const connectedCount = mockIntegrations.filter(i => i.status === 'connected').length;
    const totalCredits = mockIntegrations
      .filter(i => i.status === 'connected')
      .reduce((sum, i) => sum + i.credits, 0);
    const avgMatchRate = mockIntegrations
      .filter(i => i.status === 'connected')
      .reduce((sum, i, _, arr) => sum + i.match_rate / arr.length, 0);

    const response = {
      integrations: filteredIntegrations,
      summary: {
        total: mockIntegrations.length,
        connected: connectedCount,
        disconnected: mockIntegrations.length - connectedCount,
        total_credits: totalCredits,
        avg_match_rate: Math.round(avgMatchRate)
      }
    };

    res.status(200).json(response);
  } 
  else if (req.method === 'POST') {
    // Handle integration toggle (connect/disconnect)
    const { integration_name, action } = req.body;
    
    const integration = mockIntegrations.find(
      i => i.name.toLowerCase() === integration_name.toLowerCase()
    );
    
    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }
    
    if (action === 'connect') {
      integration.status = 'connected';
      integration.last_sync = new Date().toISOString();
      // Simulate adding some credits
      integration.credits = Math.floor(Math.random() * 1000) + 500;
      integration.match_rate = Math.floor(Math.random() * 30) + 70;
    } else if (action === 'disconnect') {
      integration.status = 'disconnected';
      integration.last_sync = null;
      integration.credits = 0;
      integration.match_rate = 0;
    }
    
    res.status(200).json({ 
      success: true, 
      message: `${integration.name} ${action}ed successfully`,
      integration 
    });
  } 
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
