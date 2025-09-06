import { faker } from '@faker-js/faker';
import { format, subDays, subHours } from 'date-fns';

// Generate mock lead data
function generateMockLeads(count = 50) {
  const statuses = ['new', 'contacted', 'qualified', 'converted', 'lost'];
  const sources = ['Google Ads', 'Facebook', 'LinkedIn', 'Organic Search', 'Direct', 'Referral'];
  const confidenceLevels = [65, 72, 78, 85, 91, 94, 97];
  
  return Array.from({ length: count }, () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const company = faker.company.name();
    
    return {
      id: faker.string.uuid(),
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      phone: faker.phone.number(),
      company: company,
      title: faker.person.jobTitle(),
      status: faker.helpers.arrayElement(statuses),
      confidence: faker.helpers.arrayElement(confidenceLevels),
      source: faker.helpers.arrayElement(sources),
      utm_source: faker.helpers.arrayElement(['google', 'facebook', 'linkedin', null]),
      utm_medium: faker.helpers.arrayElement(['cpc', 'social', 'organic', null]),
      utm_campaign: faker.helpers.maybe(() => faker.lorem.words(2), { probability: 0.6 }),
      first_seen: format(faker.date.recent({ days: 30 }), 'yyyy-MM-dd HH:mm:ss'),
      last_activity: format(faker.date.recent({ days: 7 }), 'yyyy-MM-dd HH:mm:ss'),
      created_at: format(faker.date.recent({ days: 30 }), 'yyyy-MM-dd HH:mm:ss')
    };
  });
}

// Generate CSV content
function generateCSV(leads) {
  const headers = ['Name', 'Email', 'Company', 'Title', 'Status', 'Confidence', 'Source', 'First Seen', 'Last Activity'];
  const rows = leads.map(lead => [
    lead.name,
    lead.email,
    lead.company,
    lead.title,
    lead.status,
    `${lead.confidence}%`,
    lead.source,
    lead.first_seen,
    lead.last_activity
  ]);
  
  return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
}

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  try {
    const { page = 1, limit = 50, search, status, source, format } = req.query;
    
    // Generate leads data
    let leads = generateMockLeads(200); // Generate more for filtering
    
    // Apply filters
    if (search) {
      const searchLower = search.toString().toLowerCase();
      leads = leads.filter(lead => 
        lead.name.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower) ||
        lead.company.toLowerCase().includes(searchLower)
      );
    }
    
    if (status) {
      leads = leads.filter(lead => lead.status === status);
    }
    
    if (source) {
      leads = leads.filter(lead => lead.source === source);
    }
    
    // Handle CSV export
    if (format === 'csv') {
      const csv = generateCSV(leads);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="clickrabbit-leads.csv"');
      res.status(200).send(csv);
      return;
    }
    
    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedLeads = leads.slice(startIndex, endIndex);
    
    // Response
    res.status(200).json({
      page: pageNum,
      limit: limitNum,
      total: leads.length,
      totalPages: Math.ceil(leads.length / limitNum),
      data: paginatedLeads
    });
    
  } catch (error) {
    console.error('Error in leads API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
