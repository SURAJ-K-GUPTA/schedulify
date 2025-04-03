const z = require("zod");

const jwt = require("jsonwebtoken");
const User = require("../model/User");
const bcrypt = require("bcryptjs");

const signupInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3),
});

const signInInput = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });
  

const registerController = async (req, res) => {
  const { success } = signupInput.safeParse(req.body);
  if (!success) {
    return res
      .status(400)
      .json({ message: "Invalid request", error: signupInput.error.message });
  }
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = await User.create({ username, email, password: hashedPassword });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ token });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Invalid request", error: error.message });
  }
}

const loginController = async (req, res) => {
    const { success } = signInInput.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ message: "Invalid request", error: signinInput.error.message });
    }

    try {
        const { email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ token });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = { registerController, loginController };