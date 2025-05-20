import React, { useState, useEffect, useRef } from "react";
import { FaExternalLinkAlt, FaInfoCircle, FaEdit, FaPlus, FaTrash, FaGripVertical } from "react-icons/fa";
import Swal from "sweetalert2";

// Cambia esto por tu usuario real de GitHub si es diferente
const GITHUB_USERNAME = "adrianpe937";

// ⚠️ DEBUG: Muestra si el token está presente (elimina este log en producción)
console.log("GITHUB_TOKEN:", process.env.REACT_APP_GITHUB_TOKEN);

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

// Asocia aquí el nombre del repo con la imagen que quieras mostrar
const projectImages = {
  "portfolio": "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
  "ciberseguridad": "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=600&q=80",
  "web-app": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
  // Añade aquí más repos y sus imágenes personalizadas
};

// Imagen por defecto si no hay personalizada
const defaultProjectImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80";

const marsStudioProject = {
  title: "Web de Pilates",
  link: "https://mars-studio.es/",
  techs: ["Wordpress", "CSS", "JavaScript"],
  desc: "Diseño y desarrollo de un sitio web para un estudio de pilates",
  classImage: "project-image"
};

const Projects = () => {
  const [githubProjects, setGithubProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [flipped, setFlipped] = useState({});
  const [customImages, setCustomImages] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [editImageIdx, setEditImageIdx] = useState(null);
  const [customProjects, setCustomProjects] = useState([]);
  const [customEditIdx, setCustomEditIdx] = useState(null);
  const [customEdit, setCustomEdit] = useState({});
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  // Nuevo estado para los lenguajes de cada repo
  const [repoLanguages, setRepoLanguages] = useState({});

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, {
      headers: GITHUB_TOKEN
        ? { Authorization: `Bearer ${GITHUB_TOKEN}` }
        : undefined
    })
      .then(res => {
        // Manejo de error 403 (rate limit)
        if (res.status === 403) {
          throw new Error("GitHub API rate limit excedido. Intenta de nuevo más tarde o usa un token personal.");
        }
        if (!res.ok) throw new Error("No se pudieron cargar los proyectos de GitHub");
        return res.json();
      })
      .then(async data => {
        const filtered = data.filter(repo => !repo.fork);
        setGithubProjects(filtered);
        setLoading(false);

        // Recoge los lenguajes de cada repo y guárdalos en repoLanguages
        const langs = {};
        await Promise.all(filtered.map(async repo => {
          try {
            const res = await fetch(repo.languages_url);
            if (res.ok) {
              const langsObj = await res.json();
              langs[repo.id] = Object.keys(langsObj);
            } else {
              langs[repo.id] = [];
            }
          } catch {
            langs[repo.id] = [];
          }
        }));
        setRepoLanguages(langs);
      })
      .catch(err => {
        setError(err.message || "Error al cargar los proyectos de GitHub");
        setLoading(false);
      });
  }, []);

  // Cargar imágenes personalizadas desde la base de datos al montar
  useEffect(() => {
    // Opcional: puedes cargar todas las imágenes personalizadas de la base de datos aquí
    // y asociarlas por nombre de repo
    fetch('http://localhost:5000/api/portfolio', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        // Suponiendo que cada documento tiene un campo section igual al nombre del repo
        const images = {};
        (Array.isArray(data) ? data : data.data || []).forEach(item => {
          if (item.section && item.imageUrl) {
            images[item.section.toLowerCase()] = item.imageUrl;
          }
        });
        setCustomImages(images);
      })
      .catch(err => {
        // Manejo de error de red
        setCustomImages({});
        // Opcional: setError("No se pudo conectar con el backend para cargar imágenes personalizadas");
      });
  }, []);

  // Cargar imágenes personalizadas de proyectos de GitHub desde la colección github
  useEffect(() => {
    fetch('http://localhost:5000/api/github', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        // data debe ser un array de objetos { repo, imageUrl }
        const images = {};
        (Array.isArray(data) ? data : []).forEach(item => {
          if (item.repo && item.imageUrl) {
            images[item.repo.toLowerCase()] = item.imageUrl;
          }
        });
        setCustomImages(images);
      })
      .catch(() => setCustomImages({}));
  }, []);

  // Detectar si el usuario es admin leyendo el token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(!!payload.isAdmin);
      } catch {
        setIsAdmin(false);
      }
    }
  }, []);

  // Cargar proyectos personalizados (sección: "Otros proyectos")
  useEffect(() => {
    fetch('http://localhost:5000/api/otherprojects')
      .then(res => res.json())
      .then(data => {
        setCustomProjects(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        setCustomProjects([]);
      });
  }, []);

  const handleFlip = idx => {
    setFlipped(f => ({ ...f, [idx]: !f[idx] }));
  };

  // Helper para obtener la imagen del proyecto
  const getProjectImage = (repo) => {
    const key = repo.name.toLowerCase();
    return (
      customImages[key] ||
      projectImages[repo.name] ||
      projectImages[key] ||
      defaultProjectImage
    );
  };

  // Handler para cambiar la imagen y guardar en la colección github
  const handleImageChange = (repo, idx) => e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async ev => {
        const imageData = ev.target.result;
        setCustomImages(prev => ({
          ...prev,
          [repo.name.toLowerCase()]: imageData
        }));

        try {
          const token = localStorage.getItem('token');
          // Busca si ya existe un documento github para este repo
          const res = await fetch('http://localhost:5000/api/github', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!res.ok) {
            alert("No tienes permisos para guardar imágenes personalizadas. Debes ser administrador.");
            return;
          }
          const docs = await res.json();
          const arr = Array.isArray(docs) ? docs : [];
          const found = arr.find(item => item.repo && item.repo.toLowerCase() === repo.name.toLowerCase());

          let saveRes;
          if (found) {
            // Actualiza el documento existente
            saveRes = await fetch(`http://localhost:5000/api/github/${found._id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ imageUrl: imageData }),
            });
          } else {
            // Crea un documento nuevo solo en la colección github
            saveRes = await fetch('http://localhost:5000/api/github', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ repo: repo.name, imageUrl: imageData }),
            });
          }

          if (!saveRes.ok) {
            if (saveRes.status === 413) {
              alert("La imagen es demasiado grande. Por favor, selecciona una imagen más pequeña.");
            } else if (saveRes.status === 403) {
              alert("No tienes permisos para guardar la imagen. Debes ser administrador.");
            } else {
              alert("No se pudo guardar la imagen personalizada. Intenta con una imagen más pequeña o revisa tus permisos.");
            }
          } else {
            setEditImageIdx(null); // Oculta el input tras guardar
            Swal.fire({
              icon: 'success',
              title: '¡Imagen actualizada con éxito!',
              showConfirmButton: false,
              timer: 1500
            });
          }
        } catch (err) {
          alert('Error al guardar la imagen personalizada. Intenta con una imagen más pequeña o revisa tus permisos.');
          console.error('Error al guardar la imagen personalizada:', err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Añadir nuevo proyecto personalizado (solo admin)
  const handleAddCustom = async () => {
    const token = localStorage.getItem('token');
    const nuevo = {
      content: {
        title: "Nuevo proyecto",
        desc: "Descripción...",
        link: "",
        techs: [],
        imageUrl: ""
      }
    };
    const res = await fetch('http://localhost:5000/api/otherprojects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(nuevo),
    });
    if (res.ok) {
      const data = await res.json();
      setCustomProjects(prev => [data.data, ...prev]);
      setCustomEditIdx(0);
      setCustomEdit(data.data);
    }
  };

  // Editar proyecto personalizado (solo admin)
  const handleEditCustom = idx => {
    setCustomEditIdx(idx);
    setCustomEdit(customProjects[idx]);
  };

  // Guardar edición de proyecto personalizado (solo admin)
  const handleSaveCustom = async idx => {
    const result = await Swal.fire({
      title: '¿Guardar cambios?',
      text: "¿Quieres guardar los cambios en este proyecto?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#38b2ac',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    const token = localStorage.getItem('token');
    const proj = customEdit;
    const res = await fetch(`http://localhost:5000/api/otherprojects/${proj._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(proj),
    });
    if (res.ok) {
      setCustomProjects(prev => prev.map((p, i) => i === idx ? proj : p));
      setCustomEditIdx(null);
      setCustomEdit({});
      Swal.fire({ icon: 'success', title: 'Guardado', timer: 1000, showConfirmButton: false });
    }
  };

  // Eliminar proyecto personalizado (solo admin)
  const handleDeleteCustom = async idx => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción eliminará el proyecto de forma permanente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53e3e',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    const token = localStorage.getItem('token');
    const proj = customProjects[idx];
    const res = await fetch(`http://localhost:5000/api/otherprojects/${proj._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setCustomProjects(prev => prev.filter((_, i) => i !== idx));
      Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1000, showConfirmButton: false });
    }
  };

  // Drag & drop para proyectos personalizados (solo admin)
  const handleDragStart = idx => setDraggedIdx(idx);
  const handleDragEnter = idx => {
    if (draggedIdx === null || draggedIdx === idx) return;
    setDragOverIdx(idx);
    setCustomProjects(prev => {
      const arr = [...prev];
      const [removed] = arr.splice(draggedIdx, 1);
      arr.splice(idx, 0, removed);
      setDraggedIdx(idx);
      return arr;
    });
  };
  const handleDragEnd = async () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
    // Opcional: guardar el nuevo orden en el backend si lo deseas
  };

  // Renderiza un proyecto personalizado (editable o solo vista)
  const renderCustomProject = (proj, idx) => {
    const editing = customEditIdx === idx && isAdmin;
    // Permite mostrar correctamente título, descripción, etc. tanto si están en content como en la raíz
    const content = proj.content || {};
    const title = editing
      ? customEdit.content?.title ?? content.title ?? proj.title ?? ""
      : content.title ?? proj.title ?? "";
    const desc = editing
      ? customEdit.content?.desc ?? content.desc ?? proj.desc ?? ""
      : content.desc ?? proj.desc ?? "";
    const techs = editing
      ? customEdit.content?.techs ?? content.techs ?? proj.techs ?? []
      : content.techs ?? proj.techs ?? [];
    const link = editing
      ? customEdit.content?.link ?? content.link ?? proj.link ?? ""
      : content.link ?? proj.link ?? "";
    let customImage = editing && customEdit.content?.imageUrl
      ? customEdit.content.imageUrl
      : content.imageUrl || proj.imageUrl || defaultProjectImage;

    return (
      <div
        className={`project-card${draggedIdx === idx ? " dragging" : ""}`}
        key={proj._id}
        draggable={isAdmin}
        onDragStart={isAdmin ? () => handleDragStart(idx) : undefined}
        onDragEnter={isAdmin && draggedIdx !== null && draggedIdx !== idx ? () => handleDragEnter(idx) : undefined}
        onDragEnd={isAdmin ? handleDragEnd : undefined}
        onDragOver={isAdmin && draggedIdx !== null ? e => e.preventDefault() : undefined}
      >
        {isAdmin && (
          <span style={{
            position: "absolute", top: 10, left: 10, cursor: "grab", color: "#6a3de8", fontSize: 18
          }}>
            <FaGripVertical />
          </span>
        )}
        <div
          className="experience-image"
        >
          <img
            src={customImage}
            alt={title}
          />
          {isAdmin && editing && (
            <label
              title="Cambiar imagen"
            >
              <FaEdit color="#fff" />
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={e => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = ev => {
                      setCustomEdit({
                        ...customEdit,
                        content: { ...customEdit.content, imageUrl: ev.target.result }
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          )}
        </div>
        <div className="project-info">
          {editing ? (
            <>
              <input
                type="text"
                value={customEdit.content?.title ?? content.title ?? proj.title ?? ""}
                onChange={e => setCustomEdit({
                  ...customEdit,
                  content: { ...customEdit.content, title: e.target.value }
                })}
                style={{ fontWeight: "bold", fontSize: "1.2rem", marginBottom: 8, width: "100%" }}
              />
              <textarea
                value={customEdit.content?.desc ?? content.desc ?? proj.desc ?? ""}
                onChange={e => setCustomEdit({
                  ...customEdit,
                  content: { ...customEdit.content, desc: e.target.value }
                })}
                style={{ width: "100%", minHeight: 60, marginBottom: 8 }}
              />
              <input
                type="text"
                value={customEdit.content?.link ?? content.link ?? proj.link ?? ""}
                onChange={e => setCustomEdit({
                  ...customEdit,
                  content: { ...customEdit.content, link: e.target.value }
                })}
                placeholder="Enlace"
                style={{ width: "100%", marginBottom: 8 }}
              />
              <input
                type="text"
                value={
                  Array.isArray(customEdit.content?.techs)
                    ? customEdit.content.techs.join(", ")
                    : Array.isArray(content.techs)
                    ? content.techs.join(", ")
                    : Array.isArray(proj.techs)
                    ? proj.techs.join(", ")
                    : ""
                }
                onChange={e => setCustomEdit({
                  ...customEdit,
                  content: { ...customEdit.content, techs: e.target.value.split(",").map(t => t.trim()) }
                })}
                placeholder="Tecnologías separadas por coma"
                style={{ width: "100%", marginBottom: 8 }}
              />
              <button onClick={() => handleSaveCustom(idx)} style={{ marginRight: 8 }}>Guardar</button>
              <button onClick={() => setCustomEditIdx(null)}>Cancelar</button>
            </>
          ) : (
            <>
              <h4>{title}</h4>
              <div className="project-tech">
                {Array.isArray(techs) && techs.map((tech, i) => <span key={i}>{tech}</span>)}
              </div>
              <p>{desc}</p>
              {link && (
                <a href={link} target="_blank" rel="noopener noreferrer" className="project-link">
                  <FaExternalLinkAlt /> Ver proyecto
                </a>
              )}
              {isAdmin && (
                <div style={{ marginTop: 10 }}>
                  <button onClick={() => handleEditCustom(idx)} style={{ marginRight: 8 }}>
                    <FaEdit /> Editar
                  </button>
                  <button onClick={() => handleDeleteCustom(idx)}>
                    <FaTrash /> Eliminar
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <h2 className="section-title">Mis proyectos de Github</h2>
      <p>Estos son algunos de los proyectos personales que me han permitido poner en práctica lo aprendido, experimentar con nuevas tecnologías y resolver problemas reales de forma creativa.

Mi perfil en GitHub refleja esa evolución como desarrollador: desde aplicaciones simples en consola hasta sistemas completos con interfaces gráficas, bases de datos, frameworks modernos y enfoque en la seguridad.</p>
      {loading && <div style={{ textAlign: "center", margin: "2rem" }}>Cargando proyectos de GitHub...</div>}
      {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
      <div className="projects-grid">
        {/* Proyectos de GitHub */}
        {githubProjects.map((repo, idx) => (
          <div
            className={`project-card flip-card${flipped["gh"+idx] ? " flipped" : ""}`}
            key={repo.id}
            tabIndex={0}
            onMouseEnter={() => setTimeout(() => setFlipped(f => ({ ...f, ["gh"+idx]: true })), 120)}
            onMouseLeave={() => setTimeout(() => setFlipped(f => ({ ...f, ["gh"+idx]: false })), 120)}
            onFocus={() => setFlipped(f => ({ ...f, ["gh"+idx]: true }))}
            onBlur={() => setFlipped(f => ({ ...f, ["gh"+idx]: false }))}
            style={{
              // No transición si admin está editando la imagen de este proyecto
              transition: isAdmin && editImageIdx === idx
                ? "none"
                : "box-shadow 0.7s cubic-bezier(.23,1,.32,1), transform 0.7s cubic-bezier(.23,1,.32,1)",
            }}
          >
            <div className="flip-card-inner">
              {/* Front */}
              <div className="flip-card-front">
                <div
                  className="project-image"
                  style={{
                    backgroundImage: `url(${getProjectImage(repo)})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    height: "200px",
                    position: "relative"
                  }}
                >
                  <div className="project-overlay">
                    <h4>{repo.name}</h4>
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="project-link">
                      <FaExternalLinkAlt /> Ver proyecto
                    </a>
                  </div>
                </div>
                <div className="project-info">
                  <h4>{repo.name}</h4>
                  <div className="project-tech">
                    {/* Mostrar todos los lenguajes detectados automáticamente */}
                    {repoLanguages[repo.id] && repoLanguages[repo.id].length > 0
                      ? repoLanguages[repo.id].map(lang => <span key={lang}>{lang}</span>)
                      : repo.language && <span>{repo.language}</span>
                    }
                  </div>
                  <button
                    className="project-flip-btn"
                    type="button"
                    aria-label="Ver explicación"
                    onClick={e => {
                      e.stopPropagation();
                      handleFlip("gh"+idx);
                    }}
                  >
                    <FaInfoCircle /> Info
                  </button>
                </div>
              </div>
              {/* Back */}
              <div className="flip-card-back">
                <div className="project-back-content" style={{ position: "relative" }}>
                  <h4>{repo.name}</h4>
                  <p>{repo.description || "Sin descripción"}</p>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-back-link"
                  >
                    <FaExternalLinkAlt /> Ver proyecto
                  </a>
                  {/* Solo admin: botón para editar imagen en la parte trasera */}
                  {isAdmin && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        id={`edit-image-input-${idx}`}
                        onChange={handleImageChange(repo, idx)}
                      />
                      <button
                        style={{
                          marginTop: 16,
                          marginBottom: 8,
                          padding: "10px 18px",
                          borderRadius: 8,
                          background: "#6a3de8",
                          color: "#fff",
                          border: "none",
                          fontWeight: "bold",
                          fontSize: "1rem",
                          cursor: "pointer",
                          width: "100%",
                          display: "block"
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          document.getElementById(`edit-image-input-${idx}`).click();
                        }}
                        type="button"
                      >
                        Editar imagen
                      </button>
                    </>
                  )}
                  <button
                    className="project-flip-btn"
                    type="button"
                    aria-label="Volver"
                    onClick={e => {
                      e.stopPropagation();
                      handleFlip("gh"+idx);
                    }}
                  >
                    Volver
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Otros proyectos */}
      <h2 className="section-title" style={{ marginTop: "3rem" }}>Otros proyectos</h2>
      <p>Además de mis proyectos personales, también he participado en el desarrollo de diversas aplicaciones, Estos proyectos me permitieron trabajar en contextos reales, cumpliendo con requisitos de clientes y plazos definidos, aprendiendo a comunicarme con personas no técnicas y adaptando el desarrollo a necesidades específicas.</p>
      {isAdmin && (
        <button
          className="add-button"
          style={{ marginBottom: 20, marginLeft: 10 }}
          onClick={handleAddCustom}
        >
          <FaPlus /> Añadir proyecto
        </button>
      )}
      <div className="projects-grid">
        {customProjects.map((proj, idx) => renderCustomProject(proj, idx))}
      </div>
    </>
  );
};

export default Projects;
