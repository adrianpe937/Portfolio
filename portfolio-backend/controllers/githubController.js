const Github = require('../models/Github');

exports.getAll = async (req, res) => {
  try {
    const data = await Github.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener imágenes de GitHub', error });
  }
};

exports.add = async (req, res) => {
  try {
    const { repo, imageUrl } = req.body;
    const newDoc = new Github({ repo, imageUrl });
    await newDoc.save();
    res.status(201).json(newDoc);
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar imagen de GitHub', error });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;
    const updated = await Github.findByIdAndUpdate(id, { imageUrl }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar imagen de GitHub', error });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await Github.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar imagen de GitHub', error });
  }
};
