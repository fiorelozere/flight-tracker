const { faker } = require('@faker-js/faker');
const fs = require('fs');

function createRandomTicket() {
  const ticketType = faker.helpers.arrayElement(['Economy', 'Business', 'First Class']);
  const fromDate = faker.date.future();
  // Ensure to_date is after from_date by adding a random duration (e.g., 1 to 30 days)
  const toDate = new Date(fromDate);
  toDate.setDate(fromDate.getDate() + faker.number.int({ min: 1, max: 30 }));
  const id = faker.string.uuid();
  return {
    id: id,
    inbound: faker.location.city(),
    outbound: faker.location.city(),
    ticket_type: ticketType,
    ticket_type_id: `${id}-${ticketType}`,
    price: faker.number.int({ min: 100, max: 2000 }),
    from_date: fromDate.toLocaleDateString(),
    to_date: toDate.toLocaleDateString(),
    seat_number: faker.helpers.arrayElement(['12A', '14B', '16C', '18D', '20E', '22F']),
  };
}

// Generate multiple tickets with incremental IDs
function generateTickets(count, startId) {
  const tickets = [];
  for (let i = 0; i < count; i++) {
    tickets.push(createRandomTicket(startId + i));
  }
  return tickets;
}

// Ensure db.json exists with initial structure if not present
const dbFilePath = 'db.json';
let dbData = { tickets: [] };
let startId = 1;

if (fs.existsSync(dbFilePath)) {
  // Read the existing db.json file
  const rawData = fs.readFileSync(dbFilePath);
  dbData = JSON.parse(rawData);
  // Get the max id from existing tickets
  const existingIds = dbData.tickets.map(ticket => ticket.id);
  if (existingIds.length > 0) {
    startId = Math.max(...existingIds) + 1;
  }
} else {
  // Create an initial db.json file with an empty tickets array
  fs.writeFileSync(dbFilePath, JSON.stringify(dbData, null, 2));
}

// Generate 500 tickets starting from the next available ID
const tickets = generateTickets(10000, startId);

// Merge the new tickets with the existing tickets
dbData.tickets = dbData.tickets.concat(tickets);

// Write the updated data back to db.json
fs.writeFileSync(dbFilePath, JSON.stringify(dbData, null, 2), (err) => {
  if (err) {
    console.error('Error writing to db.json', err);
  } else {
    console.log('Successfully added tickets to db.json');
  }
});
