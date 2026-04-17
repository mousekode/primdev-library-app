// profiles.controller.js

import prisma from '../configs/database.config.js' // Import Prisma Client dari file database.js

export const getAllProfiles = async (req, res) => {
  // TODO: CODE GET ALL CATEGORIES
  // Mengambil semua buku dari database menggunakan Prisma Client
  const profiles = await prisma.profiles.findMany()
  
  res.json({
    "success": true,
    "message": "Profiles retrieved successfully",
    "data": profiles
  })
}

export const getProfileById = async (req, res) => {
  // TODO: CODE GET CATEGORY BY ID
  const id = parseInt(req.params.id);
    const profile = await prisma.profiles.findUnique({
        where: { id: id }
    });
    if (!profile) {
        return res.json({
            "success": false,
            "message": `Profile with ID: ${id} not found`
        });
    }
    res.json({
        "success": true,
        "data": profile
    });
}

export const createProfile = async (req, res) => {
  // TODO: CODE CREATE CATEGORY
  const { name, email, password } = req.body;
    const profile = await prisma.profiles.create({
        data: { name, email, password }
    });
    res.json({
        "success": true,
        "message": "Profile created successfully",
        "data": profile
    });
}

export const updateProfile = async (req, res) => {
  // TODO: CODE UPDATE CATEGORY
  const id = parseInt(req.params.id);
    const { name, email, password } = req.body;
    const profile = await prisma.profiles.findUnique({
        where: { id: id }
    });
    if (!profile) {
        return res.json({
            "success": false,
            "message": `Profile with ID: ${id} not found`
        });
    }
    const updatedProfile = await prisma.profiles.update({
        where: { id: id },
        data: { name, email, password }
    });
    res.json({
        "success": true,
        "message": "Profile updated successfully",
        "data": updatedProfile
    });
}

export const deleteProfile = async (req, res) => {
  // TODO: CODE DELETE CATEGORY
  const id = parseInt(req.params.id);
    const profile = await prisma.profiles.findUnique({
        where: { id: id }
    });
    if (!profile) {
        return res.json({
            "success": false,
            "message": `Profile with ID: ${id} not found`
        });
    }
    await prisma.profiles.delete({
        where: { id: id }
    });
    res.json({
        "success": true,
        "message": "Profile deleted successfully"
    });
}