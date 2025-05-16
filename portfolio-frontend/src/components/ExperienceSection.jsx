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
  // Nuevo: para editar título y foto
  handleEditTitle,
  handleEditImage,
}) => {
  // --- Drag & Drop puro JS ---
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const dragItem = useRef(null);

  // Inicia el drag
  const handleDragStart = (index) => {
    setDraggedIndex(index);
    dragItem.current = index;
  };

  // Cuando entra en otra tarjeta
  const handleDragEnter = (index) => {
    setDragOverIndex(index);
    if (draggedIndex === null || draggedIndex === index) return;
    // Reordena visualmente al arrastrar sobre otra tarjeta
    const newList = [...datosPortfolio];
    const [removed] = newList.splice(draggedIndex, 1);
    newList.splice(index, 0, removed);
    setDraggedIndex(index);
    setDatosPortfolio(newList);
  };

  // Finaliza el drag
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    dragItem.current = null;
  };

  // Estilo de la tarjeta arrastrada
  const getItemStyle = (index) => ({
    opacity: draggedIndex === index ? 0.7 : 1,
    zIndex: draggedIndex === index ? 5 : 1,
    boxShadow: draggedIndex === index
      ? "0 12px 24px rgba(106,61,232,0.25)"
      : "var(--card-shadow)",
    background: dragOverIndex === index && draggedIndex !== null ? "#f3f0ff" : undefined,
    position: "relative",
    width: "calc(50% - 1.25rem)",
    transition: "box-shadow 0.18s, opacity 0.18s, background 0.18s",
    cursor: "grab",
  });

  // Estilo del grid
  const getGridStyle = () => ({
    minHeight: "350px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "2.5rem",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto 3rem auto",
    overflow: "hidden",
  });

  // Helpers para edición de título y foto
  const getEditedValue = (id, field, fallback) => {
    const edit = datosEditados?.find(e => e._id === id);
    return edit && edit[field] !== undefined ? edit[field] : fallback;
  };

  return (
    <section className="mi-experiencia-section" data-aos="fade-up">
      <h2 className="section-title">Mi Experiencia</h2>
      <div
        className="top-buttons"
        style={{
          justifyContent: "flex-start",
          marginBottom: "1.2rem",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "flex-start",
          display: "flex",
        }}
      >
        <button
          className="add-button"
          style={{ background: "#888", color: "white" }}
          onClick={handleSelectAll}
        >
          {idsSeleccionados.length > 0 ? "Deseleccionar" : "Seleccionar"}
        </button>
        {idsSeleccionados.length > 1 && (
          <button className="delete-btn" onClick={handleDeleteMultiple}>
            <FaTrash className="button-icon" /> Eliminar seleccionadas ({idsSeleccionados.length})
          </button>
        )}
        {idsSeleccionados.length === 1 && (
          <button className="delete-btn" onClick={() => handleDelete(idsSeleccionados[0])}>
            <FaTrash className="button-icon" /> Eliminar seleccionada
          </button>
        )}
        {idsSeleccionados.length <= 1 && (
          <>
            <button className="edit-button" onClick={handleEditToggle}>
              <FaEdit className="button-icon" />
              {editando ? "Guardar cambios" : "Editar contenido"}
            </button>
            <button className="add-button" onClick={handleAdd}>
              <FaPlus className="button-icon" />
              Agregar sección
            </button>
          </>
        )}
      </div>

      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div
          className="mi-experiencia-grid"
          style={getGridStyle()}
        >
          {datosPortfolio.map(({ _id, section, content, imageUrl }, i) => {
            const isSelected = idsSeleccionados.includes(_id);
            // Permite edición en tiempo real de título y foto
            const editedTitle = getEditedValue(_id, "section", section);
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

            return (
              <div
                key={_id}
                className={`experience-card${draggedIndex === i ? " dragging" : ""}${isSelected ? " selected-card" : ""}`}
                style={getItemStyle(i)}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragEnter={draggedIndex !== null && draggedIndex !== i ? () => handleDragEnter(i) : undefined}
                onDragEnd={handleDragEnd}
                onDragOver={e => draggedIndex !== null && e.preventDefault()}
                data-aos={draggedIndex !== i ? "fade-up" : undefined}
                data-aos-delay={draggedIndex !== i ? i * 100 : undefined}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSelectCard(_id)}
                  style={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    zIndex: 2,
                    width: 22,
                    height: 22,
                    accentColor: "#6a3de8",
                  }}
                  aria-label="Seleccionar sección"
                />
                {/* Imagen editable */}
                <div className="experience-image" style={{ position: "relative" }}>
                  <img
                    src={customImage}
                    alt={editedTitle}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {editando && (
                    <label
                      style={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                        background: "rgba(0,0,0,0.6)",
                        borderRadius: "50%",
                        padding: 8,
                        cursor: "pointer",
                        zIndex: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
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
                            reader.onload = ev => {
                              if (handleEditImage) {
                                handleEditImage(_id, ev.target.result);
                              } else if (typeof setDatosPortfolio === "function") {
                                setDatosPortfolio(prev =>
                                  prev.map(item =>
                                    item._id === _id
                                      ? { ...item, imageUrl: ev.target.result }
                                      : item
                                  )
                                );
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
                    {/* Título editable */}
                    {editando ? (
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
                        style={{
                          fontSize: "1.6rem",
                          fontWeight: "bold",
                          color: "#fff",
                          background: "rgba(0,0,0,0.08)",
                          border: "none",
                          borderRadius: 6,
                          padding: "0.2em 0.5em",
                          marginBottom: 0,
                          outline: "none",
                        }}
                        maxLength={60}
                      />
                    ) : (
                      <h3 className="experience-title">{editedTitle}</h3>
                    )}
                  </div>
                  <div className="section-content-wrapper">
                    {renderEditableContent(editedTitle, content, _id)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ExperienceSection;
