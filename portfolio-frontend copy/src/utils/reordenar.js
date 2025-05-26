export const reordenar = (lista, indiceInicio, indiceFin) => {
  const resultado = Array.from(lista);
  const [eliminado] = resultado.splice(indiceInicio, 1);
  resultado.splice(indiceFin, 0, eliminado);
  return resultado;
};
