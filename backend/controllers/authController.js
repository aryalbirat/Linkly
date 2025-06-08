const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Default JWT secret if not set in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'linkly_default_secret_key_for_development';

exports.register = async (req, res) => {
  const { email, password, name, role } = req.body;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  try {
    console.log(`Attempting to register user with email: ${email}`);
    
    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`User with email ${email} already exists`);
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({ email, password, name, role: role || 'user' });
    await user.save();
    
    console.log(`User registered successfully: ${email}`);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  try {
    console.log(`Attempting login for user: ${email}`);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`No user found with email: ${email}`);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`Invalid password for user: ${email}`);
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const payload = { 
      id: user._id, 
      role: user.role,
      email: user.email,
      name: user.name
    };
    
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
    console.log(`Login successful for user: ${email}`);
    
    res.json({ 
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};
