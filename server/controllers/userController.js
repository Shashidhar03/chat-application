import user from '../models/userModel.js';
import bcrypt from 'bcrypt';
import  Jwt  from 'jsonwebtoken';

const signup = async (req, res) => {
    console.log(req.body);
    try {
        const existingUser = await user.findOne({
            email: req.body.email
        });
        if (existingUser) {
            return res.status(400).json("User already exists");
        }

        const { username, email, password } = req.body;
        await bcrypt.hash(password, 12)           //hashing the password with bcrypt
        .then(async (hashedPassword) => {
            const newUser = new user({
                username:username,
                email:email,
                password: hashedPassword
            });
            await newUser.save();
            Jwt.sign({email: newUser.email,userID:newUser._id}, process.env.JWT_SECRET, {expiresIn: '24h'}, async (err, token) => {
                if (err) {
                    return res.status(500).json(err);
                }
                newUser.token = token;
                await newUser.save();
            });
            res.status(201).json("User created successfully");
        })
        .catch((error) => {
            return res.status(500).json(error);
        });
       
    } catch (error) {
        res.status(500).json(error);
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await user.findOne({ email});
        if (!existingUser) {
            return res.status(404).json("User not found");
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json("Invalid credentials");
        }
        Jwt.sign({email: existingUser.email, userID: existingUser._id}, process.env.JWT_SECRET, {expiresIn: '24h'}, async (err, token) => {
            if (err) {
                return res.status(500).json(err);
            }
            existingUser.token = token;
            await existingUser.save();
        });
        res.status(200).json(existingUser);
    }
    catch (error) {
        res.status(500).json(error);
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await user.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json(error);
    }
}

const getUser = async (req, res) => {
    try {
        const user = await user.find({_id:req.params.id});
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json(error);
    }
}

export { signup, login, getAllUsers, getUser};