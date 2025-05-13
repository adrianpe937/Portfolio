const Portfolio = require('../models/Portfolio');

const getPortfolioData = async (req, res) => {
  try {
    const data = await Portfolio.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los datos del portfolio', error });
  }
};

const addPortfolioData = async (req, res) => {
  try {
    const newData = new Portfolio(req.body);
    await newData.save();
    res.status(201).json({ data: newData });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar datos al portfolio', error });
  }
};

const updatePortfolioData = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Portfolio.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar los datos del portfolio', error });
  }
};

const deletePortfolioData = async (req, res) => {
  const { id } = req.params;
  try {
    await Portfolio.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar los datos del portfolio', error });
  }
};

module.exports = {
  getPortfolioData,
  addPortfolioData,
  updatePortfolioData,
  deletePortfolioData,
};
