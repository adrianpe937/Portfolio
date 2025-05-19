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

  return (
    <section className="mi-experiencia-section" data-aos="fade-up">
      <h2 className="section-title">Mi Experiencia</h2>
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
