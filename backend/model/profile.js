const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    user_name: {
        type: "string",
        required: [true, "Must provide Username"],
        trim: true,
        minlength: [5, "Username cannot be less than 5 characters"],
        maxlength: [15, "Username cannot be more than 15 characters"],
        unique: [true, "Username already exists"],
        match: [/^[A-Za-z]+$/, "Username must contain only alphabetical letters"],
    },
    user_address: {
        type: "string",
        required: [true, "Must provide Useraddress"],
        trim: true,
        minlength: [15, "Useraddress cannot be less than 15 characters"],
        unique: [true, "Useraddress already exists"],
    },
    bio: {
        type: "string",
        required: [true, "Must provide bio"],
        trim: true,
        minlength: [15, "Useraddress cannot be less than 15 characters"],
        maxlength: [80, "Useraddress cannot be more than 80 characters"],
    },
    date_created: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Profile", ProfileSchema);
