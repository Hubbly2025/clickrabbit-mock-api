// Shared mock data utilities for the ClickRabbit API

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

// Generate random names and companies
function getRandomName() {
  const firstNames = [
    'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn',
    'Sage', 'River', 'Phoenix', 'Rowan', 'Blake', 'Cameron', 'Drew', 'Emery'
  ];
  
  const lastNames = [
    'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez',
    'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor'
  ];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
}

function getRandomCompany() {
  const companies = [
    'Atlas Robotics', 'Zenith Labs', 'Quantum Dynamics', 'Neural Networks Inc',
    'DataFlow Systems', 'CloudVantage', 'TechNova', 'InnovateCorp', 'FutureScale',
    'DigitalEdge', 'CyberCore', 'NexusPoint', 'VelocityTech', 'ApexSolutions',
    'TechCorp', 'InnovateLabs', 'DataSync', 'CloudFirst', 'NextGen Systems'
  ];
  
  return companies[Math.floor(Math.random() * companies.length)];
}

function getRandomEmail(name, company) {
  const domain = company.toLowerCase().replace(/\s/g, '').replace(/[^a-z]/g, '') + '.com';
  const nameParts = name.toLowerCase().split(' ');
  return `${nameParts[0]}.${nameParts[1]}@${domain}`;
}

function getRandomDate(daysBack = 30) {
  const now = new Date();
  const pastDate = new Date(now.getTime() - (Math.random() * daysBack * 24 * 60 * 60 * 1000));
  return pastDate.toISOString();
}

// Export utilities
module.exports = {
  generateTimeSeries,
  getRandomName,
  getRandomCompany,
  getRandomEmail,
  getRandomDate
};
