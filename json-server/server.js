const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'top-secret'; // Use a secure key in production

// Use default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Login endpoint
server.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = router.db.get('users').find({ username, password }).value();

  if (user) {
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.jsonp({ token });
  } else {
    res.status(401).jsonp({ error: "Incorrect username or password" });
  }
});

server.use((req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
    try {
      const decoded = jwt.verify(token, SECRET_KEY);

      // Attach user information to request
      req.user = decoded;

      next();
    } catch (error) {
      res.status(401).jsonp({ error: "Invalid token" });
    }
  } else {
    res.status(401).jsonp({ error: "Access denied. No token provided." });
  }
});

server.post('/tickets', (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    // inbound, outbound, from_date, to_date, and seat_number
    const { inbound, outbound, from_date, to_date, seat_number, ticket_type } = req.body;
    if (inbound && outbound && from_date && to_date && seat_number && ticket_type) {
      const existingTicket = router.db.get('tickets').find({ inbound, outbound, from_date, to_date, seat_number }).value();
      if (!existingTicket) {
        // Create the new ticket
        const newTicket = router.db.get('tickets').insert(req.body).write();

        // Update the ticket with ticket_type_id
        router.db.get('tickets').find({ id: newTicket.id }).assign({ ticket_type_id: `${newTicket.id}-${ticket_type}` }).write();

        return res.status(200).jsonp({ message: "Ticket created successfully" });
      } else {
        return res.status(400).jsonp({ error: "Ticket already exists" });
      }
    } else {
      return res.status(400).jsonp({ error: "Missing required fields" });
    }
  } else {
    return res.status(403).jsonp({ error: "Access denied. Admins only." });
  }
});

// Custom route to get ticket sales over time
server.get('/dashboard/ticket-sales-over-time', (req, res) => {
  const tickets = router.db.get('tickets').value();
  const salesOverTime = tickets.reduce((acc, ticket) => {
    const month = new Date(ticket.from_date).toISOString().slice(0, 7);
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month]++;
    return acc;
  }, {});

  res.json(salesOverTime);
});

// Custom route to get average ticket price by ticket type
server.get('/dashboard/average-price-by-ticket-type', (req, res) => {
  const tickets = router.db.get('tickets').value();
  const priceByType = tickets.reduce((acc, ticket) => {
    if (!acc[ticket.ticket_type]) {
      acc[ticket.ticket_type] = { total: 0, count: 0 };
    }
    acc[ticket.ticket_type].total += ticket.price;
    acc[ticket.ticket_type].count++;
    return acc;
  }, {});

  const averagePriceByType = Object.keys(priceByType).reduce((acc, type) => {
    acc[type] = priceByType[type].total / priceByType[type].count;
    return acc;
  }, {});

  res.json(averagePriceByType);
});



// Use default router
server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running with JWT Authentication');
});
