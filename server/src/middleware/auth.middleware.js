const { Clerk } = require('@clerk/clerk-sdk-node');

if (!process.env.CLERK_SECRET_KEY) {
  console.error('CLERK_SECRET_KEY is not set!');
}

const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

const customAuthMiddleware = async (req, res, next) => {
  console.log('Request Headers:', req.headers);
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.log('No token found in headers.');
    return res.status(401).json({ message: 'Please log in first.' });
  }

  try {
    console.log('Verifying token...');
    const claims = await clerk.verifyToken(token);
    if (!claims) {
      console.log('Token verification failed: No claims.');
      return res.status(401).json({ message: 'Invalid token.' });
    }
    console.log('Token verified successfully. Claims:', claims);
    req.auth = { userId: claims.sub };
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Authentication failed.' });
  }
};

module.exports = { customAuthMiddleware };
