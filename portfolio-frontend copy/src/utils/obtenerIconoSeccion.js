import { FaCode, FaLaptopCode, FaShieldAlt } from "react-icons/fa";

export const obtenerIconoSeccion = (titulo) => {
  const lower = titulo.toLowerCase();
  if (lower.includes('seguridad') || lower.includes('ciber')) return <FaShieldAlt className="section-icon" />;
  if (lower.includes('desarrollo') || lower.includes('web')) return <FaLaptopCode className="section-icon" />;
  return <FaCode className="section-icon" />;
};
