const bcrypt = require('bcrypt');
const {createTherapist,findTherapistById, getAvilableTherapists, isLicenseVerified } = require('../models/therapistModel');
const {createUser, findUserByEmail} = require('../models/authModel');

exports.registerTherapist = async (req, res) => {
    //Some validation result
    //const errors =
    const { email, password, firstName, lastName, address, licenseNumber, specialization, experienceYears, monthlyRate } = req.body;
    if (!(email && password && licenseNumber && specialization && firstName && lastName && address)) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    //To resgiter as a therapist you need:
    try{
        if (!await isLicenseVerified(licenseNumber)) {
            return res.status(403).json({ error: "License number is not verified" });
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: "User already exists with this email" });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const {userId} = await createUser(email, passwordHash, 'therapist');
        const therapist = await createTherapist(userId, licenseNumber,specialization, experienceYears, monthlyRate);

        res.status(201).json({
            message: 'Therapist registered successfully',
            therapist: {
                id: therapist.id,
                userId,
                firstName,
                lastName,
                email,
                address,
                licenseNumber,
                specialization,
                experienceYears,
                monthlyRate,
                createdAt: therapist.created_at,
                updatedAt: therapist.updated_at
            }
        });
    }
    catch(error){
        console.error("Error registering therapist:", error);
        res.status(500).json({message:"Therapist registration failed", error: error.message});
    }

    
};

exports.getTherapistDetails = async (req, res) => {
    const therapistId = req.params.id;
    try{
        const therapist = await findTherapistById(therapistId);
        if(!therapist){
            return res.status(404).json({error: "Therapist not found"});
        }
        res.json({message: "Therapist details success",therapist});
    }
    catch(error){
        console.error("Error therapist details:", error);
        res.status(500).json({error: "Failed to fetch therapisr details", message: error.message});
    }
}

exports.listAvailableTherapists = async (req, res) => {
    try{
        const therapists = await getAvilableTherapists();
        if(therapists.length == 0){
            return res.status(404).json({message: "No available therapists found"});
        }
        res.json({message: "Available therapists retrieved successfully", therapists});
    }
    catch(error){
        console.error("Error retrieving available therapists:", error)
        res.status(500).json({error: "Failed to fetch available therapists", message: error.message});
    }
};



//module.exports = {registerTherapist, getTherapistDetails, listAvailableTherapists};