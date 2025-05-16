export function manejarInicioArrastre(indice, e, setIndiceArrastrado, setTarjetaArrastrando, datosPortfolio, itemArrastrado) {
  itemArrastrado.current = indice;
  setIndiceArrastrado(indice);
  setTarjetaArrastrando(datosPortfolio[indice]);
  document.body.style.userSelect = "none";
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  }
}

export function manejarArrastre(e, indiceArrastrado, setPosicionRaton) {
  if (indiceArrastrado !== null && typeof e.clientX === "number" && typeof e.clientY === "number") {
    setPosicionRaton({ x: e.clientX, y: e.clientY });
  }
}

export function manejarEntrarArrastre(indice, indiceArrastrado, setIndiceSobre, setDatosPortfolio, itemSobre) {
  if (indiceArrastrado === null || indiceArrastrado === indice) return;
  itemSobre.current = indice;
  setIndiceSobre(indice);

  setDatosPortfolio(prev => {
    const arr = [...prev];
    const [eliminado] = arr.splice(indiceArrastrado, 1);
    arr.splice(indice, 0, eliminado);
    return arr;
  });
}

export function manejarSalirArrastre(setIndiceSobre) {
  setIndiceSobre(null);
}

export function manejarFinArrastre(itemArrastrado, itemSobre, setIndiceArrastrado, setIndiceSobre, setTarjetaArrastrando) {
  itemArrastrado.current = null;
  itemSobre.current = null;
  setIndiceArrastrado(null);
  setIndiceSobre(null);
  setTarjetaArrastrando(null);
  document.body.style.userSelect = "";
}
