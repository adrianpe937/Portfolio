import React from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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
}) => {
  // Drag and drop en grid de 2 columnas
  const getGridStyle = (isDraggingOver) => ({
    minHeight: "350px",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "2.5rem",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto 3rem auto",
    background: isDraggingOver ? "#f0f8ff" : undefined,
    transition: "background 0.2s"
  });

  // Corrige el reordenamiento para grid (flat array, no por filas)
  const onDragEnd = (result) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;
    const reordered = Array.from(datosPortfolio);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setDatosPortfolio(reordered);
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
          display: "flex"
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
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="experiencia-droppable" direction="vertical">
            {(provided, snapshot) => (
              <div
                className="mi-experiencia-grid"
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={getGridStyle(snapshot.isDraggingOver)}
              >
                {datosPortfolio.map(({ _id, section, content, imageUrl }, i) => {
                  const isSelected = idsSeleccionados.includes(_id);
                  let customImage = imageUrl;
                  if (!customImage) {
                    if (section && section.toLowerCase().includes("portfolio")) {
                      customImage = "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80";
                    } else if (section && section.toLowerCase().includes("seguridad")) {
                      customImage = "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=600&q=80";
                    } else if (section && section.toLowerCase().includes("web")) {
                      customImage = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80";
                    } else if (section && section.toLowerCase().includes("formación")) {
                      customImage = "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80";
                    } else {
                      customImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80";
                    }
                  }
                  return (
                    <Draggable key={_id} draggableId={_id} index={i}>
                      {(provided, snapshot) => (
                        <div
                          className={`experience-card${snapshot.isDragging ? " dragging" : ""}${isSelected ? " selected-card" : ""}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            "--i": i,
                            opacity: snapshot.isDragging ? 0.7 : 1,
                            transition: "box-shadow 0.18s, opacity 0.18s",
                            marginBottom: "0"
                          }}
                          data-aos="fade-up"
                          data-aos-delay={i * 100}
                        >
                          {/* Checkbox para seleccionar */}
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
                              accentColor: "#6a3de8"
                            }}
                            aria-label="Seleccionar sección"
                          />
                          {/* Imagen personalizada */}
                          <div className="experience-image">
                            <img src={customImage} alt={section} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                          <div className="experience-content">
                            <div className="experience-header">
                              <div className="experience-icon">
                                {getSectionIcon(section)}
                              </div>
                              <h3 className="experience-title">{section}</h3>
                            </div>
                            <div className="section-content-wrapper">
                              {renderEditableContent(section, content, _id)}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </section>
  );
};

export default ExperienceSection;
