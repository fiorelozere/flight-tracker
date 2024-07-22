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

// Middleware to protect other routes
server.use((req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      next();
    } catch (error) {
      res.status(401).jsonp({ error: "Invalid token" });
    }
  } else {
    res.status(401).jsonp({ error: "Access denied. No token provided." });
  }
});

// Use default router
server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running with JWT Authentication');
});
