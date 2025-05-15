import React, { useState, useEffect, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../css/Portfolio.css';
import {
  FaCode,
  FaLaptopCode,
  FaShieldAlt,
  FaEdit,
  FaPlus,
  FaTrash,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import Swal from 'sweetalert2';

const Portfolio = () => {
  // =======================
  // Estados
  // =======================
  const [portfolioData, setPortfolioData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState(null); // Estado para manejar errores
  const tokenGuardado = localStorage.getItem('token');
  const [editedData, setEditedData] = useState([]); // Nuevo estado para edición
  const [selectedIds, setSelectedIds] = useState([]); // IDs seleccionados para eliminar múltiple

  // =======================
  // Refs para campos editables
  // =======================
  const editableRefs = useRef({});

  // =======================
  // Efectos
  // =======================
  useEffect(() => {
    const fetchPortfolioData = async () => {
      AOS.init({ duration: 1000 });
      try {
        const response = await fetch('http://localhost:5000/api/portfolio', {
          headers: {
            'Authorization': `Bearer ${tokenGuardado}`, // Asegúrate de que el token se envíe correctamente
          },
        });
        if (!response.ok) throw new Error('Error al obtener los datos del portfolio');
        const data = await response.json();
        setPortfolioData(data);
      } catch (error) {
        setError('Error al obtener los datos del portfolio'); // Guardamos el error en el estado
        console.error('Error al obtener los datos del portfolio:', error);
      }
    };

    fetchPortfolioData();

    // Detectar modo oscuro por defecto
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDarkMode);
  }, []);


  document.addEventListener("DOMContentLoaded", () => {
  /* ------------------------------
     MODO OSCURO / CLARO
  ------------------------------ */
  const toggleTheme = document.querySelector("#theme-toggle");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = localStorage.getItem("theme") === "dark" || (!localStorage.getItem("theme") && prefersDark);
  if (isDark) document.body.classList.add("dark-mode");

  toggleTheme?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", theme);
  });

  /* ------------------------------
     EFECTO RIPPLE EN BOTONES
  ------------------------------ */
  const buttons = document.querySelectorAll(".btn-ripple");
  buttons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const circle = document.createElement("span");
      circle.classList.add("ripple");
      this.appendChild(circle);
      const diameter = Math.max(this.clientWidth, this.clientHeight);
      const radius = diameter / 2;
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - this.offsetLeft - radius}px`;
      circle.style.top = `${e.clientY - this.offsetTop - radius}px`;
      setTimeout(() => circle.remove(), 600);
    });
  });

  /* ------------------------------
     ANIMACIÓN AL SCROLLEAR
  ------------------------------ */
  const revealElements = document.querySelectorAll(".reveal");
  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.85;
    revealElements.forEach((el) => {
      const boxTop = el.getBoundingClientRect().top;
      if (boxTop < triggerBottom) {
        el.classList.add("show");
      } else {
        el.classList.remove("show");
      }
    });
  };
  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll(); // Inicializa

  /* ------------------------------
     TOOLTIP PERSONALIZADO
  ------------------------------ */
  const tooltips = document.querySelectorAll("[data-tooltip]");
  tooltips.forEach((el) => {
    const tooltipText = el.getAttribute("data-tooltip");
    const tooltip = document.createElement("div");
    tooltip.className = "custom-tooltip";
    tooltip.textContent = tooltipText;
    document.body.appendChild(tooltip);

    el.addEventListener("mouseenter", () => {
      const rect = el.getBoundingClientRect();
      tooltip.style.top = `${rect.top - 30}px`;
      tooltip.style.left = `${rect.left + rect.width / 2}px`;
      tooltip.classList.add("visible");
    });

    el.addEventListener("mouseleave", () => {
      tooltip.classList.remove("visible");
    });
  });

  /* ------------------------------
     EFECTO DE CAMBIO DE SECCIÓN (smooth)
  ------------------------------ */
  const links = document.querySelectorAll("a[href^='#']");
  links.forEach((link) =>
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    })
  );
});


  //ACTUALIZAR DATOS EN SERVIDOR//

  const saveSectionChanges = async (id) => {
  const sectionToSave = portfolioData.find(item => item._id === id);

  try {
    const res = await fetch(`http://localhost:5000/api/portfolio/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenGuardado}`, // Incluye el token
      },
      body: JSON.stringify(sectionToSave),
    });

    if (!res.ok) throw new Error('Error al guardar los cambios');
  } catch (error) {
    console.error('Error al guardar cambios en el servidor:', error);
  }
};


// =======================
// Funciones auxiliares
// =======================
const getSectionIcon = (title) => {
  const lower = title.toLowerCase();
  if (lower.includes('seguridad') || lower.includes('ciber')) return <FaShieldAlt className="section-icon" />;
  if (lower.includes('desarrollo') || lower.includes('web')) return <FaLaptopCode className="section-icon" />;
  return <FaCode className="section-icon" />;
};

// =======================
// Función para reordenar el array
// =======================
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// =======================
// Drag and drop con HTML5 API (tarjeta flotante visual mejorada)
// =======================
const dragItem = useRef();
const dragOverItem = useRef();
const [draggedIndex, setDraggedIndex] = useState(null);
const [hoveredIndex, setHoveredIndex] = useState(null);
const [draggingCard, setDraggingCard] = useState(null);
const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

const handleDragStart = (index, e) => {
  dragItem.current = index;
  setDraggedIndex(index);
  setDraggingCard(portfolioData[index]);
  document.body.style.userSelect = "none";
  // Para que el drag sea más fluido y no muestre el "ghost" nativo
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  }
};

const handleDrag = (e) => {
  // Solo actualiza si realmente se está arrastrando
  if (draggedIndex !== null && typeof e.clientX === "number" && typeof e.clientY === "number") {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }
};

const handleDragEnter = (index) => {
  if (draggedIndex === null || draggedIndex === index) return;
  dragOverItem.current = index;
  setHoveredIndex(index);

  // Mueve la tarjeta visualmente en el array mientras arrastras
  setPortfolioData(prev => {
    const arr = [...prev];
    const [removed] = arr.splice(draggedIndex, 1);
    arr.splice(index, 0, removed);
    setDraggedIndex(index);
    return arr;
  });
};

const handleDragLeave = () => {
  setHoveredIndex(null);
};

const handleDragEnd = () => {
  dragItem.current = null;
  dragOverItem.current = null;
  setDraggedIndex(null);
  setHoveredIndex(null);
  setDraggingCard(null);
  document.body.style.userSelect = "";
};

const renderEditableContent = (section, content, _id) => {
  // Busca el contenido editado si está en modo edición
  const currentContent = isEditing
    ? editedData.find(item => item._id === _id)?.content ?? content
    : content;

  if (typeof currentContent === 'string') {
    return (
      <p
        className={`section-content ${isEditing ? 'editing' : ''}`}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        ref={el => { if (el) editableRefs.current[`${_id}-main`] = el; }}
        onBlur={e => handleContentChange(_id, e.currentTarget.textContent)}
      >
        {currentContent}
      </p>
    );
  }

  if (Array.isArray(currentContent)) {
    // Experiencia
    if (section === 'Experiencia') {
      return currentContent.map((item, idx) => (
        <div key={idx} className="experience-block">
          <h4
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            ref={el => { if (el) editableRefs.current[`${_id}-exp-titulo-${idx}`] = el; }}
            onBlur={e => handleNestedContentChange(_id, idx, 'titulo', e.currentTarget.textContent)}
          >
            {item.titulo}
          </h4>
          <p
            className="experience-date"
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            ref={el => { if (el) editableRefs.current[`${_id}-exp-fecha-${idx}`] = el; }}
            onBlur={e => handleNestedContentChange(_id, idx, 'fecha', e.currentTarget.textContent)}
          >
            {item.fecha}
          </p>
          <ul>
            {item.descripcion.map((desc, i) => (
              <li
                key={i}
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                ref={el => { if (el) editableRefs.current[`${_id}-exp-desc-${idx}-${i}`] = el; }}
                onBlur={e =>
                  handleNestedDescriptionChange(_id, idx, i, e.currentTarget.textContent)
                }
              >
                {desc}
              </li>
            ))}
          </ul>
        </div>
      ));
    }

    // Formación
    if (section === 'Formación') {
      return currentContent.map((item, idx) => (
        <div key={idx} className="formacion-block">
          <h4
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            ref={el => { if (el) editableRefs.current[`${_id}-form-titulo-${idx}`] = el; }}
            onBlur={e => handleNestedContentChange(_id, idx, 'titulo', e.currentTarget.textContent)}
          >
            {item.titulo}
          </h4>
          <p
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            ref={el => { if (el) editableRefs.current[`${_id}-form-fecha-${idx}`] = el; }}
            onBlur={e => handleNestedContentChange(_id, idx, 'fecha', e.currentTarget.textContent)}
          >
            {item.fecha}
          </p>
          <p
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            ref={el => { if (el) editableRefs.current[`${_id}-form-desc-${idx}`] = el; }}
            onBlur={e =>
              handleNestedContentChange(_id, idx, 'descripcion', e.currentTarget.textContent)
            }
          >
            {item.descripcion}
          </p>
        </div>
      ));
    }

    // Idiomas
    if (section === 'Idiomas') {
      return (
        <ul>
          {currentContent.map((idioma, idx) => (
            <li key={idx}>
              <strong
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                ref={el => { if (el) editableRefs.current[`${_id}-idioma-${idx}`] = el; }}
                onBlur={e =>
                  handleNestedContentChange(_id, idx, 'idioma', e.currentTarget.textContent)
                }
              >
                {idioma.idioma}
              </strong>
              :{" "}
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                ref={el => { if (el) editableRefs.current[`${_id}-nivel-${idx}`] = el; }}
                onBlur={e =>
                  handleNestedContentChange(_id, idx, 'nivel', e.currentTarget.textContent)
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
};

// =======================
// Handlers de edición
// =======================

// Cambios en campos simples
const handleContentChange = (id, newContent) => {
  setEditedData(prev => {
    const exists = prev.find(item => item._id === id);
    if (exists) {
      return prev.map(item =>
        item._id === id ? { ...item, content: newContent } : item
      );
    } else {
      const original = portfolioData.find(item => item._id === id);
      return [...prev, { ...original, content: newContent }];
    }
  });
};

// Cambios en campos anidados (objetos/arrays)
const handleNestedContentChange = (id, index, field, newValue) => {
  setEditedData(prev => {
    const exists = prev.find(item => item._id === id);
    const original = exists || portfolioData.find(item => item._id === id);
    const newContent = Array.isArray(original.content)
      ? original.content.map((item, idx) =>
          idx === index ? { ...item, [field]: newValue } : item
        )
      : original.content;
    if (exists) {
      return prev.map(item =>
        item._id === id ? { ...item, content: newContent } : item
      );
    } else {
      return [...prev, { ...original, content: newContent }];
    }
  });
};

// Cambios en descripciones anidadas (arrays dentro de arrays)
const handleNestedDescriptionChange = (id, itemIndex, descIndex, newValue) => {
  setEditedData(prev => {
    const exists = prev.find(item => item._id === id);
    const original = exists || portfolioData.find(item => item._id === id);
    const newContent = Array.isArray(original.content)
      ? original.content.map((item, idx) => {
          if (idx === itemIndex) {
            const newDesc = Array.isArray(item.descripcion)
              ? item.descripcion.map((desc, i) =>
                  i === descIndex ? newValue : desc
                )
              : item.descripcion;
            return { ...item, descripcion: newDesc };
          }
          return item;
        })
      : original.content;
    if (exists) {
      return prev.map(item =>
        item._id === id ? { ...item, content: newContent } : item
      );
    } else {
      return [...prev, { ...original, content: newContent }];
    }
  });
};

// Guardar todos los cambios en la base de datos
const saveAllChanges = async () => {
  try {
    for (const edited of editedData) {
      const res = await fetch(`http://localhost:5000/api/portfolio/${edited._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenGuardado}`,
        },
        body: JSON.stringify(edited),
      });
      if (!res.ok) throw new Error('Error al guardar los cambios');
    }
    setPortfolioData(prev =>
      prev.map(item => {
        const edited = editedData.find(e => e._id === item._id);
        return edited ? { ...item, content: edited.content } : item;
      })
    );
    setEditedData([]);
    setIsEditing(false);
    Swal.fire({
      icon: 'success',
      title: '¡Sección guardada con éxito!',
      showConfirmButton: false,
      timer: 1500
    });
  } catch (error) {
    setError('Error al guardar los cambios');
    console.error('Error al guardar cambios en el servidor:', error);
  }
};

// Alternar modo edición y guardar cambios si se sale del modo edición
const handleEditToggle = () => {
  if (isEditing) {
    saveAllChanges();
  } else {
    setEditedData([]); // Limpia cambios previos
    setIsEditing(true);
  }
};

// =======================
// Handlers
// =======================
const handleAdd = async () => {
  try {
    const newSection = { section: 'Nueva Sección', content: 'Nuevo contenido...' };
    const res = await fetch('http://localhost:5000/api/portfolio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenGuardado}`,
      },
      body: JSON.stringify(newSection),
    });

    if (!res.ok) throw new Error('Error al agregar una nueva sección');

    const data = await res.json();
    setPortfolioData(prev => [data.data, ...prev]); // Añadir al principio
    setIsEditing(true); // Activar modo edición inmediatamente
    setEditedData([]); // Limpiar edición previa para evitar conflictos
    Swal.fire({
      icon: 'success',
      title: '¡Sección añadida con éxito!',
      showConfirmButton: false,
      timer: 1500
    });
  } catch (error) {
    console.error('Error al agregar una nueva sección:', error);
  }
};

const handleDelete = async (id) => {
  try {
    // Confirmación antes de eliminar
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción eliminará la sección de forma permanente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53e3e',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    const res = await fetch(`http://localhost:5000/api/portfolio/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${tokenGuardado}`,
      },
    });

    if (!res.ok) throw new Error('Error al eliminar la sección');

    setPortfolioData(prev => prev.filter((item) => item._id !== id));
    setSelectedIds(prev => prev.filter(_id => _id !== id)); // <-- Limpia la selección tras eliminar
    Swal.fire({
      icon: 'success',
      title: 'Sección eliminada',
      showConfirmButton: false,
      timer: 1200
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error al eliminar la sección',
      text: error.message || 'Ocurrió un error inesperado'
    });
    console.error('Error al eliminar la sección:', error);
  }
};

const toggleDarkMode = () => {
  setDarkMode(!darkMode);
  document.body.classList.toggle('dark-mode');
};

// Seleccionar/deseleccionar una tarjeta
const handleSelectCard = (id) => {
  setSelectedIds(prev =>
    prev.includes(id) ? prev.filter(_id => _id !== id) : [...prev, id]
  );
};

// Seleccionar/deseleccionar todas
const handleSelectAll = () => {
  if (selectedIds.length === 0) {
    setSelectedIds(portfolioData.map(item => item._id));
  } else {
    setSelectedIds([]);
  }
};

// Eliminar varias secciones a la vez
const handleDeleteMultiple = async () => {
  if (selectedIds.length === 0) return;
  const result = await Swal.fire({
    title: '¿Eliminar varias secciones?',
    text: `Se eliminarán ${selectedIds.length} secciones seleccionadas.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e53e3e',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });
  if (!result.isConfirmed) return;

  let errorCount = 0;
  for (const id of selectedIds) {
    try {
      const res = await fetch(`http://localhost:5000/api/portfolio/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${tokenGuardado}`,
        },
      });
      if (!res.ok) errorCount++;
    } catch {
      errorCount++;
    }
  }
  setPortfolioData(prev => prev.filter(item => !selectedIds.includes(item._id)));
  setSelectedIds([]);
  if (errorCount === 0) {
    Swal.fire({
      icon: 'success',
      title: 'Secciones eliminadas',
      showConfirmButton: false,
      timer: 1200
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Algunas secciones no se pudieron eliminar',
      text: `Errores: ${errorCount}`
    });
  }
};

// =======================
// Render
// =======================
return (
  <div
    className={`portfolio-container ${darkMode ? 'dark-mode' : 'light-mode'}`}
    onMouseMove={handleDrag}
    onMouseUp={handleDragEnd}
    style={{ position: "relative" }}
  >
    {/* Banner principal */}
    <div className="hero-banner">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="animated-title">Mi Portfolio</h1>
        <p className="hero-subtitle">Desarrollo Web & Ciberseguridad</p>
      </div>
    </div>

    {/* Botón de modo oscuro */}
    <button
      className="theme-toggle"
      onClick={toggleDarkMode}
      aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {darkMode ? "☀️" : "🌙"}
    </button>

    {/* Acerca de mí */}
    <header className="portfolio-header">
      <div className="avatar-container">
        <div className="avatar">
          <div className="avatar-placeholder">AP</div>
        </div>
      </div>

      <div className="header-content">
        <h2>Acerca de mí</h2>
        <p className="bio">
          ¡Hola! Soy <strong>adrianpe937</strong>, un desarrollador junior apasionado por la <strong>ciberseguridad</strong> y el <strong>desarrollo web</strong>.
        </p>

        <div className="skills-container">
          {['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'Ciberseguridad'].map(skill => (
            <div key={skill} className="skill-tag">{skill}</div>
          ))}
        </div>
      </div>
    </header>

    {/* Características destacadas */}
    <div className="features-grid">
      {[
        { icon: <FaLaptopCode />, title: "Desarrollo Web", text: "Creación de sitios web modernos y aplicaciones con React" },
        { icon: <FaShieldAlt />, title: "Ciberseguridad", text: "Análisis de vulnerabilidades y protección de aplicaciones" },
        { icon: <FaCode />, title: "Programación", text: "JavaScript, Python y otras tecnologías modernas" }
      ].map(({ icon, title, text }) => (
        <div className="feature-card" key={title}>
          <div className="feature-icon">{icon}</div>
          <h3>{title}</h3>
          <p>{text}</p>
        </div>
      ))}
    </div>

    {/* Secciones dinámicas de experiencia */}
    <section className="mi-experiencia-section" data-aos="fade-up">
      <h2 className="section-title">Mi Experiencia</h2>
      <div className="top-buttons" style={{ justifyContent: "flex-start", marginBottom: "2.5rem" }}>
        {/* Botón seleccionar */}
        <button
          className="add-button"
          style={{ background: "#888", color: "white" }}
          onClick={handleSelectAll}
        >
          {selectedIds.length > 0
            ? "Deseleccionar"
            : "Seleccionar"}
        </button>
        {/* Botón eliminar múltiples */}
        {selectedIds.length > 1 && (
          <button
            className="delete-btn"
            style={{ marginLeft: "1rem", background: "#e53e3e", color: "white", position: "relative" }}
            onClick={handleDeleteMultiple}
          >
            <FaTrash className="button-icon" /> Eliminar seleccionadas ({selectedIds.length})
          </button>
        )}
        {/* Botón eliminar individual (cuando hay solo una seleccionada) */}
        {selectedIds.length === 1 && (
          <button
            className="delete-btn"
            style={{ marginLeft: "1rem", background: "#e53e3e", color: "white", position: "relative" }}
            onClick={() => handleDelete(selectedIds[0])}
          >
            <FaTrash className="button-icon" /> Eliminar seleccionada
          </button>
        )}
        {/* Botón editar y agregar solo si no hay selección múltiple */}
        {selectedIds.length <= 1 && (
          <>
            <button className="edit-button" style={{ marginLeft: "1rem" }} onClick={handleEditToggle}>
              <FaEdit className="button-icon" />
              {isEditing ? 'Guardar cambios' : 'Editar contenido'}
            </button>
            <button className="add-button" style={{ marginLeft: "1rem" }} onClick={handleAdd}>
              <FaPlus className="button-icon" />
              Agregar sección
            </button>
          </>
        )}
      </div>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="mi-experiencia-grid">
          {portfolioData.map(({ _id, section, content, index, imageUrl }, i) => {
            let dragClass = "";
            if (draggedIndex === i && draggingCard) dragClass = "dragging";
            if (hoveredIndex === i && draggedIndex !== null && draggedIndex !== i) dragClass = "drag-over";
            const isSelected = selectedIds.includes(_id);

            // Imagen personalizada: si es portfolio, pon una imagen de portfolio
            let customImage = imageUrl;
            if (!customImage) {
              if (section.toLowerCase().includes("portfolio")) {
                customImage = "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80";
              } else if (section.toLowerCase().includes("seguridad")) {
                customImage = "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=600&q=80";
              } else if (section.toLowerCase().includes("web")) {
                customImage = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80";
              } else if (section.toLowerCase().includes("formación")) {
                customImage = "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80";
              } else {
                customImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80";
              }
            }

            // Oculta el botón eliminar si hay una seleccionada pero no es esta
            const showDelete =
              (!isEditing && selectedIds.length === 1 && isSelected) ||
              (isEditing && (selectedIds.length <= 1 || isSelected));

            return (
              <div
                key={_id}
                className={`experience-card ${dragClass} ${isSelected ? "selected-card" : ""}`}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                style={{
                  "--i": i,
                  opacity: draggedIndex === i && draggingCard ? 0.3 : 1,
                  transition: "transform 0.18s cubic-bezier(.4,2,.6,1), opacity 0.18s"
                }}
                draggable
                onDragStart={e => handleDragStart(i, e)}
                onDragEnter={() => handleDragEnter(i)}
                onDragLeave={handleDragLeave}
                onDragEnd={handleDragEnd}
                onDragOver={e => e.preventDefault()}
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
                    {showDelete && (
                      <div className="experience-actions">
                        <button className="delete-btn" onClick={() => handleDelete(_id)}>
                          <FaTrash className="button-icon" /> Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {/* ...existing code for floating card... */}
          {draggingCard && (
            <div
              className="floating-card"
              style={{
                position: "fixed",
                left: mousePosition.x + 10,
                top: mousePosition.y + 10,
                width: "350px",
                pointerEvents: "none",
                zIndex: 9999,
                opacity: 0.95,
                transition: "left 0.08s, top 0.08s"
              }}
            >
              <div className="experience-card dragging floating">
                <div className="experience-image">
                  <img
                    src={
                      draggingCard.imageUrl ||
                      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={draggingCard.section}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div className="experience-content">
                  <div className="experience-header">
                    <div className="experience-icon">
                      {getSectionIcon(draggingCard.section)}
                    </div>
                    <h3 className="experience-title">{draggingCard.section}</h3>
                  </div>
                  <div className="section-content-wrapper">
                    <div className="section-content">{typeof draggingCard.content === "string" ? draggingCard.content : ""}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>

    {/* Proyectos destacados */}
    <h2 className="section-title">Proyectos Destacados</h2>
    <div className="projects-grid">
      {[
        {
          title: "Web de Pilates",
          link: "https://mars-studio.es/",
          techs: ["Wordpress", "CSS", "JavaScript"],
          desc: "Diseño y desarrollo de un sitio web para un estudio de pilates",
          classImage: "project-image"
        },
        {
          title: "Portafolio Personal",
          link: "#",
          techs: ["React", "Node.js", "CSS"],
          desc: "Mi sitio web personal construido con React y Node.js",
          classImage: "project-image project-image-2"
        }
      ].map(({ title, link, techs, desc, classImage }) => (
        <div className="project-card" key={title}>
          <div className={classImage}>
            <div className="project-overlay">
              <h4>{title}</h4>
              <a href={link} target="_blank" rel="noopener noreferrer" className="project-link">
                <FaExternalLinkAlt /> Ver proyecto
              </a>
            </div>
          </div>
          <div className="project-info">
            <h4>{title}</h4>
            <p>{desc}</p>
            <div className="project-tech">
              {techs.map(tech => <span key={tech}>{tech}</span>)}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Contacto */}
    <div className="contact-section">
      <h2>¿Interesado en trabajar juntos?</h2>
      <p>Me encantaría colaborar en tu próximo proyecto</p>
      <a href="mailto:adrianpe937@gmail.com" className="contact-button">Contáctame</a>
      <div className="social-links">
        <a
          href="https://github.com/adrianpe937"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          aria-label="GitHub"
          title="GitHub"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          ></svg>
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.082-.729.082-.729 1.205.086 1.84 1.236 1.84 1.236 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.3-5.467-1.332-5.467-5.931 0-1.31.467-2.382 1.235-3.22-.123-.303-.535-1.522.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 013.003-.404c1.018.005 2.043.137 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.653 1.654.241 2.873.118 3.176.77.838 1.233 1.91 1.233 3.22 0 4.61-2.807 5.628-5.48 5.922.43.37.823 1.102.823 2.222v3.293c0 .32.218.694.825.576C20.565 21.796 24 17.298 24 12c0-6.63-5.37-12-12-12z"/>
          
        </a>
      </div>
    </div>
  </div>
);
};

export default Portfolio;