import Swal from "sweetalert2";

export async function guardarTodosLosCambios(datosEditados, setDatosPortfolio, setDatosEditados, setEditando, tokenGuardado, setError) {
  try {
    for (const editado of datosEditados) {
      const res = await fetch(`http://localhost:5000/api/portfolio/${editado._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenGuardado}`,
        },
        body: JSON.stringify(editado),
      });
      if (!res.ok) throw new Error('Error al guardar los cambios');
    }
    setDatosPortfolio(prev =>
      prev.map(item => {
        const editado = datosEditados.find(e => e._id === item._id);
        return editado ? { ...item, content: editado.content } : item;
      })
    );
    setDatosEditados([]);
    setEditando(false);
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
}

export function manejarToggleEdicion(editando, guardarTodosLosCambiosFn, setDatosEditados, setEditando) {
  if (editando) {
    guardarTodosLosCambiosFn();
  } else {
    setDatosEditados([]);
    setEditando(true);
  }
}
