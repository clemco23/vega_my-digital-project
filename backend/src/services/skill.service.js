const prisma = require("../config/prisma");

const getAllSkills = async () => {
  return prisma.skill.findMany();
};

const createSkill = async (label) => {
  return prisma.skill.create({ data: { label } });
};

const deleteSkill = async (id) => {
  return prisma.skill.delete({ where: { id: parseInt(id) } });
};

const addSkillToProduct = async (productId, skillId) => {
  return prisma.productSkill.create({
    data: {
      productId: parseInt(productId),
      skillId: parseInt(skillId),
    },
  });
};

const removeSkillFromProduct = async (productId, skillId) => {
  return prisma.productSkill.delete({
    where: {
      productId_skillId: {
        productId: parseInt(productId),
        skillId: parseInt(skillId),
      },
    },
  });
};

module.exports = {
  getAllSkills,
  createSkill,
  deleteSkill,
  addSkillToProduct,
  removeSkillFromProduct,
};