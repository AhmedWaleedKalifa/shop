const prisma = require("../config/prisma");

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { email, name, role } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: "User ID Is Required" });
    }
    
    const existing = await prisma.user.findUnique({
      where: { id },
    });
    
    if (!existing) {
      return res.status(404).json({ error: "This user is not found" });
    }
    
    const updateData = {};
    let emailExists = null; 

    if (email !== undefined) {
      if (email !== existing.email) {
        emailExists = await prisma.user.findUnique({ 
          where: { email },
        });
      }
      
      if (emailExists) { 
        return res.status(400).json({ error: "This Email Is Already Exists" });
      }
      
      updateData.email = email;
    }
    
    if (name !== undefined) {
      updateData.name = name;
    }
    
    if (role !== undefined) {
      updateData.role = role;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No Valid Fields to update" });
    }
    
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
    
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(500).json({
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await prisma.user.delete({
      where: { id },
    });
    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }
    return res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany();
    if (!users || users.length == 0) {
      return res.status(404).json({ error: "No Users found" });
    }
    return res.status(200).json({message:"Get Users Successfully",users:users});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return res.status(404).json({ error: "User Not found" });
    }

    return res.status(200).json({
      message: "get user successfully",
      user: user,
      
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
module.exports = {
  updateUser,
  deleteUser,
  getUsers,
  getUserById,
};
