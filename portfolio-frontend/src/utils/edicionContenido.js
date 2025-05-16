import React from "react";

// Recibe los handlers como argumentos para mantener el estado fuera de este archivo
export function renderizarContenidoEditable(
  seccion,
  contenido,
  _id,
  editando,
  datosEditados,
  datosPortfolio,
  refsEditables,
  manejarCambioContenido,
  manejarCambioContenidoAnidado,
  manejarCambioDescripcionAnidada
) {
  const contenidoActual = editando
    ? datosEditados.find(item => item._id === _id)?.content ?? contenido
    : contenido;

  if (typeof contenidoActual === 'string') {
    return (
      <p
        className={`section-content ${editando ? 'editing' : ''}`}
        contentEditable={editando}
        suppressContentEditableWarning={true}
        ref={el => { if (el) refsEditables.current[`${_id}-main`] = el; }}
        onBlur={e => manejarCambioContenido(_id, e.currentTarget.textContent)}
      >
        {contenidoActual}
      </p>
    );
  }

  if (Array.isArray(contenidoActual)) {
    if (seccion === 'Experiencia') {
      return contenidoActual.map((item, idx) => (
        <div key={idx} className="experience-block">
          <h4
            contentEditable={editando}
            suppressContentEditableWarning={true}
            ref={el => { if (el) refsEditables.current[`${_id}-exp-titulo-${idx}`] = el; }}
            onBlur={e => manejarCambioContenidoAnidado(_id, idx, 'titulo', e.currentTarget.textContent)}
          >
            {item.titulo}
          </h4>
          <p
            className="experience-date"
            contentEditable={editando}
            suppressContentEditableWarning={true}
            ref={el => { if (el) refsEditables.current[`${_id}-exp-fecha-${idx}`] = el; }}
            onBlur={e => manejarCambioContenidoAnidado(_id, idx, 'fecha', e.currentTarget.textContent)}
          >
            {item.fecha}
          </p>
          <ul>
            {item.descripcion.map((desc, i) => (
              <li
                key={i}
                contentEditable={editando}
                suppressContentEditableWarning={true}
                ref={el => { if (el) refsEditables.current[`${_id}-exp-desc-${idx}-${i}`] = el; }}
                onBlur={e =>
                  manejarCambioDescripcionAnidada(_id, idx, i, e.currentTarget.textContent)
                }
              >
                {desc}
              </li>
            ))}
          </ul>
        </div>
      ));
    }

    if (seccion === 'Formación') {
      return contenidoActual.map((item, idx) => (
        <div key={idx} className="formacion-block">
          <h4
            contentEditable={editando}
            suppressContentEditableWarning={true}
            ref={el => { if (el) refsEditables.current[`${_id}-form-titulo-${idx}`] = el; }}
            onBlur={e => manejarCambioContenidoAnidado(_id, idx, 'titulo', e.currentTarget.textContent)}
          >
            {item.titulo}
          </h4>
          <p
            contentEditable={editando}
            suppressContentEditableWarning={true}
            ref={el => { if (el) refsEditables.current[`${_id}-form-fecha-${idx}`] = el; }}
            onBlur={e => manejarCambioContenidoAnidado(_id, idx, 'fecha', e.currentTarget.textContent)}
          >
            {item.fecha}
          </p>
          <p
            contentEditable={editando}
            suppressContentEditableWarning={true}
            ref={el => { if (el) refsEditables.current[`${_id}-form-desc-${idx}`] = el; }}
            onBlur={e =>
              manejarCambioContenidoAnidado(_id, idx, 'descripcion', e.currentTarget.textContent)
            }
          >
            {item.descripcion}
          </p>
        </div>
      ));
    }

    if (seccion === 'Idiomas') {
      return (
        <ul>
          {contenidoActual.map((idioma, idx) => (
            <li key={idx}>
              <strong
                contentEditable={editando}
                suppressContentEditableWarning={true}
                ref={el => { if (el) refsEditables.current[`${_id}-idioma-${idx}`] = el; }}
                onBlur={e =>
                  manejarCambioContenidoAnidado(_id, idx, 'idioma', e.currentTarget.textContent)
                }
              >
                {idioma.idioma}
              </strong>
              :{" "}
              <span
                contentEditable={editando}
                suppressContentEditableWarning={true}
                ref={el => { if (el) refsEditables.current[`${_id}-nivel-${idx}`] = el; }}
                onBlur={e =>
                  manejarCambioContenidoAnidado(_id, idx, 'nivel', e.currentTarget.textContent)
                }
              >
                {idioma.nivel}
              </span>
            </li>
          ))}
        </ul>
      );
    }
  }

  return null;
}

// Los handlers de edición pueden ir aquí o en otro archivo si prefieres
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
