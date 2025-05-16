import Swal from "sweetalert2";

export async function manejarAgregar(setDatosPortfolio, setEditando, setDatosEditados, tokenGuardado) {
  try {
    const nuevaSeccion = { section: 'Nueva Sección', content: 'Nuevo contenido...' };
    const res = await fetch('http://localhost:5000/api/portfolio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenGuardado}`,
      },
      body: JSON.stringify(nuevaSeccion),
    });

    if (!res.ok) throw new Error('Error al agregar una nueva sección');

    const data = await res.json();
    setDatosPortfolio(prev => [data.data, ...prev]);
    setEditando(true);
    setDatosEditados([]);
    Swal.fire({
      icon: 'success',
      title: '¡Sección añadida con éxito!',
      showConfirmButton: false,
      timer: 1500
    });
  } catch (error) {
    console.error('Error al agregar una nueva sección:', error);
  }
}

export async function manejarEliminar(id, setDatosPortfolio, setIdsSeleccionados, tokenGuardado) {
  try {
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

    setDatosPortfolio(prev => prev.filter((item) => item._id !== id));
    setIdsSeleccionados(prev => prev.filter(_id => _id !== id));
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
}

export async function manejarEliminarMultiples(idsSeleccionados, setDatosPortfolio, setIdsSeleccionados, tokenGuardado) {
  if (idsSeleccionados.length === 0) return;
  const result = await Swal.fire({
    title: '¿Eliminar varias secciones?',
    text: `Se eliminarán ${idsSeleccionados.length} secciones seleccionadas.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e53e3e',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });
  if (!result.isConfirmed) return;

  let errorCount = 0;
  for (const id of idsSeleccionados) {
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
  setDatosPortfolio(prev => prev.filter(item => !idsSeleccionados.includes(item._id)));
  setIdsSeleccionados([]);
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
}

export function manejarSeleccionarTodas(idsSeleccionados, setIdsSeleccionados, datosPortfolio) {
  if (idsSeleccionados.length === 0) {
    setIdsSeleccionados(datosPortfolio.map(item => item._id));
  } else {
    setIdsSeleccionados([]);
  }
}

export function manejarSeleccionTarjeta(id, idsSeleccionados, setIdsSeleccionados) {
  setIdsSeleccionados(prev =>
    prev.includes(id) ? prev.filter(_id => _id !== id) : [...prev, id]
  );
}
