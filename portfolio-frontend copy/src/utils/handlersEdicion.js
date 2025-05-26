export function manejarCambioContenido(id, nuevoContenido, setDatosEditados, datosPortfolio) {
  setDatosEditados(prev => {
    const existe = prev.find(item => item._id === id);
    if (existe) {
      return prev.map(item =>
        item._id === id ? { ...item, content: nuevoContenido } : item
      );
    } else {
      const original = datosPortfolio.find(item => item._id === id);
      return [...prev, { ...original, content: nuevoContenido }];
    }
  });
}

export function manejarCambioContenidoAnidado(id, indice, campo, nuevoValor, setDatosEditados, datosPortfolio) {
  setDatosEditados(prev => {
    const existe = prev.find(item => item._id === id);
    const original = existe || datosPortfolio.find(item => item._id === id);
    const nuevoContenido = Array.isArray(original.content)
      ? original.content.map((item, idx) =>
          idx === indice ? { ...item, [campo]: nuevoValor } : item
        )
      : original.content;
    if (existe) {
      return prev.map(item =>
        item._id === id ? { ...item, content: nuevoContenido } : item
      );
    } else {
      return [...prev, { ...original, content: nuevoContenido }];
    }
  });
}

export function manejarCambioDescripcionAnidada(id, indiceItem, indiceDesc, nuevoValor, setDatosEditados, datosPortfolio) {
  setDatosEditados(prev => {
    const existe = prev.find(item => item._id === id);
    const original = existe || datosPortfolio.find(item => item._id === id);
    const nuevoContenido = Array.isArray(original.content)
      ? original.content.map((item, idx) => {
          if (idx === indiceItem) {
            const nuevaDesc = Array.isArray(item.descripcion)
              ? item.descripcion.map((desc, i) =>
                  i === indiceDesc ? nuevoValor : desc
                )
              : item.descripcion;
            return { ...item, descripcion: nuevaDesc };
          }
          return item;
        })
      : original.content;
    if (existe) {
      return prev.map(item =>
        item._id === id ? { ...item, content: nuevoContenido } : item
      );
    } else {
      return [...prev, { ...original, content: nuevoContenido }];
    }
  });
}
