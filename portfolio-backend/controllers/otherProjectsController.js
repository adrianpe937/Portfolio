const OtherProject = require('../models/OtherProject');

exports.getOtherProjects = async (req, res) => {
  try {
    const data = await OtherProject.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener otros proyectos', error });
  }
};

exports.addOtherProject = async (req, res) => {
  try {
    const newData = new OtherProject(req.body);
    await newData.save();
    res.status(201).json({ data: newData });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar proyecto', error });
  }
};

exports.updateOtherProject = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await OtherProject.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar proyecto', error });
  }
};

exports.deleteOtherProject = async (req, res) => {
  const { id } = req.params;
  try {
    await OtherProject.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar proyecto', error });
  }
};
