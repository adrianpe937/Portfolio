import React, { useRef, useState } from "react";
import { FaEdit, FaPlus, FaTrash, FaCamera } from "react-icons/fa";

const ExperienceSection = ({
  datosPortfolio = [],
  idsSeleccionados = [],
  editando = false,
  error,
  handleSelectAll,
  handleDeleteMultiple,
  handleDelete,
  handleEditToggle,
  handleAdd,
  handleSelectCard,
  renderEditableContent,
  getSectionIcon,
  setDatosPortfolio,
  datosEditados = [],
  handleEditTitle,
  handleEditImage,
}) => {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const dragItem = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", content: "" });

  // Detectar si el usuario es admin leyendo el token
  let isAdmin = false;
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      isAdmin = !!payload.isAdmin;
    }
  } catch {
    isAdmin = false;
  }

  const handleDragStart = (index) => {
    setDraggedIndex(index);
    dragItem.current = index;
  };

  const handleDragEnter = (index) => {
    setDragOverIndex(index);
    if (draggedIndex === null || draggedIndex === index) return;
    const newList = [...datosPortfolio];
    const [removed] = newList.splice(draggedIndex, 1);
    newList.splice(index, 0, removed);
    setDraggedIndex(index);
    setDatosPortfolio(newList);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    dragItem.current = null;
  };

  // Helpers para edición de título y foto
  const getEditedValue = (id, field, fallback) => {
    const edit = datosEditados?.find(e => e._id === id);
    return edit && edit[field] !== undefined ? edit[field] : fallback;
  };

  // Modal simple para mostrar contenido completo
  const ExperienceModal = ({ open, onClose, title, content }) => {
    if (!open) return null;
    return (
      <div
        className="experience-modal-overlay"
        onClick={onClose}
        tabIndex={-1}
      >
        <div
          className="experience-modal-content"
          onClick={e => e.stopPropagation()}
        >
          <button
            className="experience-modal-close-btn"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
          {/* Título siempre fijo arriba */}
          <div className="experience-modal-title-fixed">
            <h2>{title}</h2>
          </div>
          <div className="modal-body experience-modal-body-scroll">
            {content}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="mi-experiencia-section" data-aos="fade-up">
      <h2 className="section-title">Mi experiencia como desarrollador</h2>
      <p>Desde que comencé en el mundo del desarrollo, he tenido la oportunidad de participar en proyectos reales que me han permitido aprender de forma práctica y profundizar en distintas áreas como la ciberseguridad, el desarrollo web y la administración de sistemas. Aquí te cuento un poco más de cada experiencia:

</p>
      {/* Solo mostrar botones si es admin */}
      {isAdmin && (
        <div className="top-buttons">
          <button
            className="add-button"
            onClick={handleSelectAll}
            disabled={!isAdmin}
            title={!isAdmin ? "Solo administradores pueden seleccionar" : undefined}
          >
            {idsSeleccionados.length > 0 ? "Deseleccionar" : "Seleccionar"}
          </button>
          {idsSeleccionados.length > 1 && (
            <button className="delete-btn" onClick={handleDeleteMultiple} disabled={!isAdmin}>
              <FaTrash className="button-icon" /> Eliminar seleccionadas ({idsSeleccionados.length})
            </button>
          )}
          {idsSeleccionados.length === 1 && (
            <button className="delete-btn" onClick={() => handleDelete(idsSeleccionados[0])} disabled={!isAdmin}>
              <FaTrash className="button-icon" /> Eliminar seleccionada
            </button>
          )}
          {idsSeleccionados.length <= 1 && (
            <>
              <button className="edit-button" onClick={handleEditToggle} disabled={!isAdmin}>
                <FaEdit className="button-icon" />
                {editando ? "Guardar cambios" : "Editar contenido"}
              </button>
              <button className="add-button" onClick={handleAdd} disabled={!isAdmin}>
                <FaPlus className="button-icon" />
                Agregar sección
              </button>
            </>
          )}
        </div>
      )}

      {/* No mostrar mensaje de solo admin */}
      {/* {!isAdmin && (
        <div style={{ color: "#e53e3e", fontWeight: 600, marginBottom: 16, textAlign: "center" }}>
          Solo los administradores pueden editar la experiencia.
        </div>
      )} */}

      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="mi-experiencia-grid">
          {datosPortfolio.map(({ _id, section, content, imageUrl }, i) => {
            const isSelected = idsSeleccionados.includes(_id);
            const editedTitle = getEditedValue(_id, "section", section);
            const editedContent = getEditedValue(_id, "content", content);
            const editedImage = getEditedValue(_id, "imageUrl", imageUrl);

            let customImage = editedImage;
            if (!customImage) {
              if (editedTitle?.toLowerCase().includes("portfolio")) {
                customImage = "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80";
              } else if (editedTitle?.toLowerCase().includes("seguridad")) {
                customImage = "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=600&q=80";
              } else if (editedTitle?.toLowerCase().includes("web")) {
                customImage = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80";
              } else if (editedTitle?.toLowerCase().includes("formación")) {
                customImage = "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80";
              } else {
                customImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80";
              }
            }

            // Calcula el texto de la tarjeta una sola vez
            const cardText = typeof editedContent === "string"
              ? editedContent
              : (Array.isArray(editedContent) ? editedContent.join("\n") : (editedContent && typeof editedContent === "object" ? Object.values(editedContent).join("\n") : ""));

            // Procesa el texto para mostrar títulos y ¿Qué hice? en la tarjeta (previsualización)
            function renderPreviewContent(text) {
              if (!text) return null;
              // Divide por saltos de línea simples o dobles
              const blocks = text.split(/\n+/g);
              let lines = [];
              let count = 0;
              for (let idx = 0; idx < blocks.length; idx++) {
                if (count >= 18) break; // Limita a 18 líneas aprox
                const trimmed = blocks[idx].trim();
                if (!trimmed) continue;
                // h3 si termina en ":":
                if (trimmed.endsWith(":")) {
                  lines.push(
                    <h3 key={idx} className="experience-block-h3">
                      {trimmed}
                    </h3>
                  );
                  count++;
                  continue;
                }
                // ¿Qué hice? o variantes, estilo especial
                if (/¿?que hice\??/i.test(trimmed.replace(/\s/g, ""))) {
                  lines.push(
                    <div key={idx} className="experience-block-quehice">
                      {trimmed}
                    </div>
                  );
                  count++;
                  continue;
                }
                // Subtítulo especial (ej: Tecnologías usadas)
                if (/^tecnolog[ií]as usadas:?/i.test(trimmed)) {
                  lines.push(
                    <span key={idx} className="experience-block-subtitle">
                      {trimmed}
                    </span>
                  );
                  count++;
                  continue;
                }
                // Lista: línea con varias comas y no demasiado larga
                if (trimmed.split(",").length > 2 && trimmed.length < 120) {
                  lines.push(
                    <ul key={idx} className="experience-block-list">
                      {trimmed.split(",").map((item, i) =>
                        <li key={i}>{item.trim()}</li>
                      )}
                    </ul>
                  );
                  count++;
                  continue;
                }
                // Si el bloque contiene varios puntos, sepáralos visualmente
                if (trimmed.split(". ").length > 1 && trimmed.length > 40) {
                  trimmed.split(". ").forEach((sentence, j, arr) => {
                    if (count >= 18) return;
                    const withDot = sentence.endsWith(".") || j === arr.length - 1 ? sentence : sentence + ".";
                    lines.push(
                      <p key={idx + "-p-" + j} className="experience-block-paragraph" style={{ marginBottom: "0.7em" }}>
                        {withDot}
                      </p>
                    );
                    count++;
                  });
                  continue;
                }
                // Párrafo normal
                lines.push(
                  <p key={idx} className="experience-block-paragraph">{trimmed}</p>
                );
                count++;
              }
              return lines;
            }

            // Para el modal: renderizado avanzado (títulos, listas, etc.)
            function renderExperienceContent(text) {
              if (!text) return null;
              const blocks = text.split(/\n+/g);
              return blocks.map((block, idx) => {
                const trimmed = block.trim();
                if (trimmed.endsWith(":")) {
                  return (
                    <h3 key={idx} className="experience-block-h3">
                      {trimmed}
                    </h3>
                  );
                }
                if (/¿?que hice\??/i.test(trimmed.replace(/\s/g, ""))) {
                  return (
                    <div key={idx} className="experience-block-quehice">
                      {trimmed}
                    </div>
                  );
                }
                if (/^tecnolog[ií]as usadas:?/i.test(trimmed)) {
                  return (
                    <span key={idx} className="experience-block-subtitle">
                      {trimmed}
                    </span>
                  );
                }
                if (trimmed.split(",").length > 2 && trimmed.length < 120) {
                  return (
                    <ul key={idx} className="experience-block-list">
                      {trimmed.split(",").map((item, i) =>
                        <li key={i}>{item.trim()}</li>
                      )}
                    </ul>
                  );
                }
                if (trimmed.split(". ").length > 1 && trimmed.length > 40) {
                  return trimmed.split(". ").map((sentence, j, arr) => {
                    const withDot = sentence.endsWith(".") || j === arr.length - 1 ? sentence : sentence + ".";
                    return (
                      <p key={j} className="experience-block-paragraph" style={{ marginBottom: "0.7em" }}>
                        {withDot}
                      </p>
                    );
                  });
                }
                return (
                  <p key={idx} className="experience-block-paragraph">{trimmed}</p>
                );
              });
            }

            // Render editable content as JSX for card
            const contentJSX = (
              <div className="experience-description-clamp">
                {renderExperienceContent(cardText)}
              </div>
            );
            const contentText = cardText;

            const maxLines = 18;

            return (
              <div
                key={_id}
                className={`experience-card${draggedIndex === i ? " dragging" : ""}${isSelected ? " selected-card" : ""}`}
                draggable={isAdmin}
                onDragStart={isAdmin ? () => handleDragStart(i) : undefined}
                onDragEnter={isAdmin && draggedIndex !== null && draggedIndex !== i ? () => handleDragEnter(i) : undefined}
                onDragEnd={isAdmin ? handleDragEnd : undefined}
                onDragOver={isAdmin && draggedIndex !== null ? e => e.preventDefault() : undefined}
                data-aos={draggedIndex !== i ? "fade-up" : undefined}
                data-aos-delay={draggedIndex !== i ? i * 100 : undefined}
              >
                {/* Solo admin puede seleccionar */}
                {isAdmin && (
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectCard(_id)}
                    className="experience-checkbox"
                    aria-label="Seleccionar sección"
                    disabled={!isAdmin}
                  />
                )}
                <div className="experience-image">
                  <img
                    src={customImage}
                    alt={editedTitle}
                  />
                  {/* Solo admin puede editar imagen */}
                  {editando && isAdmin && (
                    <label
                      className="experience-image-edit-label"
                      title="Cambiar imagen"
                    >
                      <FaCamera color="#fff" />
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = async ev => {
                              const imageData = ev.target.result;
                              if (handleEditImage) {
                                handleEditImage(_id, imageData);
                              } else if (typeof setDatosPortfolio === "function") {
                                setDatosPortfolio(prev =>
                                  prev.map(item =>
                                    item._id === _id
                                      ? { ...item, imageUrl: imageData }
                                      : item
                                  )
                                );
                              }
                              try {
                                const token = localStorage.getItem('token');
                                const res = await fetch(`http://localhost:5000/api/portfolio/${_id}`, {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`,
                                  },
                                  body: JSON.stringify({ imageUrl: imageData }),
                                });
                                if (!res.ok) {
                                  alert("No tienes permisos para guardar la imagen. Debes ser administrador.");
                                }
                              } catch (err) {
                                alert('Error al guardar la imagen. ¿Eres administrador?');
                                console.error('Error al guardar la imagen:', err);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
                <div className="experience-content">
                  <div className="experience-header">
                    <div className="experience-icon">{getSectionIcon(editedTitle)}</div>
                    {/* Solo admin puede editar título */}
                    {editando && isAdmin ? (
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={e =>
                          handleEditTitle
                            ? handleEditTitle(_id, e.target.value)
                            : setDatosPortfolio(prev =>
                                prev.map(item =>
                                  item._id === _id
                                    ? { ...item, section: e.target.value }
                                    : item
                                )
                              )
                        }
                        className="experience-title"
                        maxLength={60}
                      />
                    ) : (
                      <h3 className="experience-title" style={{
                        position: "static",
                        background: "none",
                        zIndex: 1,
                        marginBottom: "0.5rem"
                      }}>{editedTitle}</h3>
                    )}
                  </div>
                  <div className="section-content-wrapper" style={{
                    maxHeight: "none",
                    overflow: "visible",
                    position: "relative"
                  }}>
                    {/* Previsualización: renderiza títulos y ¿Qué hice? */}
                    <div className="experience-description-clamp">
                      {renderPreviewContent(cardText)}
                    </div>
                    {cardText && cardText.length > 250 && (
                      <div style={{
                        width: "100%",
                        textAlign: "right",
                        marginTop: 12
                      }}>
                        <button
                          className="experience-see-more-btn"
                          onClick={() => setModalOpen(true) || setModalContent({ title: editedTitle, content: renderExperienceContent(cardText) })}
                        >
                          Ver más
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {/* Modal para mostrar experiencia completa */}
          <ExperienceModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title={modalContent.title}
            content={modalContent.content}
          />
        </div>
      )}
    </section>
  );
};

export default ExperienceSection;
