import prisma from '../configs/database.config.js' // Import Prisma Client dari file database.js

export const getAllUsers = async (req, res) => {
    const users = await prisma.users.findMany();
    res.json({
        "success": true,
        "message": "Users retrieved successfully",
        "data": users
    });
};

export const getUserById = async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await prisma.users.findUnique({
        where: { id: id }
    });
    if (!user) {
        return res.json({
            "success": false,
            "message": `User with ID: ${id} not found`
        });
    }
    res.json({
        "success": true,
        "data": user
    });
};

export const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await prisma.users.create({
        data: { name, email, password }
    });
    res.json({
        "success": true,
        "message": "User created successfully",
        "data": user
    });
};

export const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email, password } = req.body;
    const user = await prisma.users.findUnique({
        where: { id: id }
    });
    if (!user) {
        return res.json({
            "success": false,
            "message": `User with ID: ${id} not found`
        });
    }
    const updatedUser = await prisma.users.update({
        where: { id: id },
        data: { name, email, password }
    });
    res.json({
        "success": true,
        "message": "User updated successfully",
        "data": updatedUser
    });
};

export const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await prisma.users.findUnique({
        where: { id: id }
    });
    if (!user) {
        return res.json({
            "success": false,
            "message": `User with ID: ${id} not found`
        });
    }
    await prisma.users.delete({
        where: { id: id }
    });
    res.json({
        "success": true,
        "message": "User deleted successfully"
    });
};