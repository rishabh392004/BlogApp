

const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require("crypto");
const { CreateTokenForUser } = require('../services/authentication');

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        default: './public/images/default.jpeg'
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: 'USER'
    }
}, {
    timestamps: true,
});


userSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) return next();

    const salt = randomBytes(16).toString('hex');

    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest('hex');

    user.salt = salt;
    user.password = hashedPassword;

    next
});



userSchema.static('matchPasswordandGenrateToken', async function (email, password) {

    const user = await this.findOne({ email }); 

    if (!user) throw new Error("User Not Found");

    if (!user.salt) throw new Error("Salt missing");

    const hashedPassword = createHmac("sha256", user.salt) 
        .update(password)
        .digest("hex");

    if (hashedPassword !== user.password) {
        throw new Error("Invalid Password");
    }
const token =CreateTokenForUser(user)
return token;
});

const User = model("USER", userSchema);

module.exports = User;