const Portfolio = require('../models/Portfolio');

// Obtener datos del portfolio
const getPortfolioData = async (req, res) => {
  try {
    // Log para ver el usuario autenticado
    console.log('Usuario autenticado:', req.user);
    // Ya no requiere admin, solo autenticación
    const data = await Portfolio.find(); // Obtiene los datos de la colección
    console.log('Datos obtenidos del backend:', data); // Log para depurar
    res.json(data);
  } catch (error) {
    console.error('Error al obtener los datos del portfolio:', error);
    res.status(500).json({ message: 'Error al obtener los datos del portfolio', error });
  }
};

// Agregar datos al portfolio
const addPortfolioData = async (req, res) => {
  try {
    const newData = new Portfolio(req.body);
    await newData.save();
    res.status(201).json({ data: newData });
  } catch (error) {
    console.error('Error al agregar datos al portfolio:', error);
    res.status(500).json({ message: 'Error al agregar datos al portfolio', error });
  }
};

// Actualizar datos del portfolio
const updatePortfolioData = async (req, res) => {
  const { id } = req.params;
  try {
    // Permite actualizar imageUrl además de otros campos
    const updated = await Portfolio.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    console.error('Error al actualizar los datos del portfolio:', error);
    res.status(500).json({ message: 'Error al actualizar los datos del portfolio', error });
  }
};

// Eliminar datos del portfolio
const deletePortfolioData = async (req, res) => {
  const { id } = req.params;
  try {
    await Portfolio.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar los datos del portfolio:', error);
    res.status(500).json({ message: 'Error al eliminar los datos del portfolio', error });
  }
};

module.exports = {
  getPortfolioData,
  addPortfolioData,
  updatePortfolioData,
  deletePortfolioData,
};
