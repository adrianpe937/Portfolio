import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import {
  renderizarContenidoEditable
} from "../utils/edicionContenido";
import {
  manejarCambioContenido,
  manejarCambioContenidoAnidado,
  manejarCambioDescripcionAnidada
} from "../utils/handlersEdicion";
import {
  manejarInicioArrastre,
  manejarArrastre,
  manejarEntrarArrastre,
  manejarSalirArrastre,
  manejarFinArrastre
} from "../utils/handlersDragDrop";
import {
  manejarAgregar,
  manejarEliminar,
  manejarEliminarMultiples,
  manejarSeleccionarTodas,
  manejarSeleccionTarjeta
} from "../utils/handlersAcciones";
import { guardarTodosLosCambios, manejarToggleEdicion } from "../utils/handlersGuardar";
import { alternarModoOscuro } from "../utils/handlersTema";
import { obtenerIconoSeccion } from "../utils/obtenerIconoSeccion";
import { reordenar } from "../utils/reordenar";

const usePortfolioLogic = () => {
  // =======================
  // Estados
  // =======================
  const [datosPortfolio, setDatosPortfolio] = useState([]);
  const [editando, setEditando] = useState(false);
  const [modoOscuro, setModoOscuro] = useState(false);
  const [error, setError] = useState(null);
  const tokenGuardado = localStorage.getItem('token');
  const [datosEditados, setDatosEditados] = useState([]);
  const [idsSeleccionados, setIdsSeleccionados] = useState([]);

  // =======================
  // Refs para campos editables
  // =======================
  const refsEditables = useRef({});

  // =======================
  // Estados para drag & drop
  // =======================
  const [tarjetaArrastrando, setTarjetaArrastrando] = useState(null);
  const [indiceArrastrado, setIndiceArrastrado] = useState(null);
  const [indiceSobre, setIndiceSobre] = useState(null);
  const [posicionRaton, setPosicionRaton] = useState({ x: 0, y: 0 });
  const itemArrastrado = useRef();
  const itemSobre = useRef();

  // =======================
  // Efectos
  // =======================
  useEffect(() => {
    const obtenerDatosPortfolio = async () => {
      try {
        const respuesta = await fetch('http://localhost:5000/api/portfolio', {
          headers: {
            'Authorization': `Bearer ${tokenGuardado}`,
          },
        });
        if (!respuesta.ok) throw new Error('Error al obtener los datos del portfolio');
        const datos = await respuesta.json();
        // CORRECCIÓN: El backend devuelve { data: [...] } al crear, pero [] al listar
        // Si es un array, úsalo. Si es un objeto con .data, usa .data
        if (Array.isArray(datos)) {
          setDatosPortfolio(datos);
        } else if (datos && Array.isArray(datos.data)) {
          setDatosPortfolio(datos.data);
        } else {
          setDatosPortfolio([]);
        }
      } catch (error) {
        setDatosPortfolio([]);
        setError('Error al obtener los datos del portfolio');
        console.error('Error al obtener los datos del portfolio:', error);
      }
    };

    obtenerDatosPortfolio();

    const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setModoOscuro(prefiereOscuro);
  }, []);

  //ACTUALIZAR DATOS EN SERVIDOR//
  const guardarCambiosSeccion = async (id) => {
    const seccionAGuardar = datosPortfolio.find(item => item._id === id);

    try {
      const res = await fetch(`http://localhost:5000/api/portfolio/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenGuardado}`,
        },
        body: JSON.stringify(seccionAGuardar),
      });

      if (!res.ok) throw new Error('Error al guardar los cambios');
    } catch (error) {
      console.error('Error al guardar cambios en el servidor:', error);
    }
  };

  // =======================
  // Handlers para drag & drop (enlazados con los estados locales)
  // =======================
  const handleDragStart = (indice, e) =>
    manejarInicioArrastre(indice, e, setIndiceArrastrado, setTarjetaArrastrando, datosPortfolio, itemArrastrado);

  const handleDrag = (e) =>
    manejarArrastre(e, indiceArrastrado, setPosicionRaton);

  const handleDragEnter = (indice) =>
    manejarEntrarArrastre(indice, indiceArrastrado, setIndiceSobre, setDatosPortfolio, itemSobre);

  const handleDragLeave = () =>
    manejarSalirArrastre(setIndiceSobre);

  const handleDragEnd = () =>
    manejarFinArrastre(itemArrastrado, itemSobre, setIndiceArrastrado, setIndiceSobre, setTarjetaArrastrando);

  // =======================
  // Handlers para acciones (enlazados con los estados locales)
  // =======================
  const handleAdd = () =>
    manejarAgregar(setDatosPortfolio, setEditando, setDatosEditados, tokenGuardado);

  const handleDelete = (id) =>
    manejarEliminar(id, setDatosPortfolio, setIdsSeleccionados, tokenGuardado);

  const handleDeleteMultiple = () =>
    manejarEliminarMultiples(idsSeleccionados, setDatosPortfolio, setIdsSeleccionados, tokenGuardado);

  const handleSelectAll = () =>
    manejarSeleccionarTodas(idsSeleccionados, setIdsSeleccionados, datosPortfolio);

  const handleSelectCard = (id) =>
    manejarSeleccionTarjeta(id, idsSeleccionados, setIdsSeleccionados);

  // Cambia las funciones para pasar setDatosEditados y datosPortfolio a los handlers de edición
  const handleCambioContenido = (id, nuevoContenido) =>
    manejarCambioContenido(id, nuevoContenido, setDatosEditados, datosPortfolio);

  const handleCambioContenidoAnidado = (id, indice, campo, nuevoValor) =>
    manejarCambioContenidoAnidado(id, indice, campo, nuevoValor, setDatosEditados, datosPortfolio);

  const handleCambioDescripcionAnidada = (id, indiceItem, indiceDesc, nuevoValor) =>
    manejarCambioDescripcionAnidada(id, indiceItem, indiceDesc, nuevoValor, setDatosEditados, datosPortfolio);

  // =======================
  // Handler para alternar modo oscuro
  // =======================
  const handleToggleDarkMode = () =>
    alternarModoOscuro(modoOscuro, setModoOscuro);

  // =======================
  // Handler para guardar todos los cambios
  // =======================
  const handleSaveAllChanges = () =>
    guardarTodosLosCambios(datosEditados, setDatosPortfolio, setDatosEditados, setEditando, tokenGuardado, setError);

  // =======================
  // Handler para alternar edición
  // =======================
  const handleEditToggle = () =>
    manejarToggleEdicion(editando, handleSaveAllChanges, setDatosEditados, setEditando);

  // =======================
  // Render
  // =======================
  return {
    datosPortfolio,
    setDatosPortfolio, // <-- Añade esto para que ExperienceSection lo reciba como prop
    editando,
    modoOscuro,
    error,
    idsSeleccionados,
    datosEditados,
    tarjetaArrastrando,
    indiceArrastrado,
    indiceSobre,
    posicionRaton,
    handleSelectAll,
    handleDeleteMultiple,
    handleDelete,
    handleEditToggle,
    handleAdd,
    handleSelectCard,
    renderEditableContent: (seccion, contenido, _id) =>
      renderizarContenidoEditable(
        seccion,
        contenido,
        _id,
        editando,
        datosEditados,
        datosPortfolio,
        refsEditables,
        handleCambioContenido,
        handleCambioContenidoAnidado,
        handleCambioDescripcionAnidada
      ),
    getSectionIcon: obtenerIconoSeccion,
    handleDrag,
    handleDragEnd,
    handleDragStart,
    handleDragEnter,
    handleDragLeave,
    toggleDarkMode: handleToggleDarkMode,
    darkMode: modoOscuro,
  };
};

export default usePortfolioLogic;