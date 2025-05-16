export function alternarModoOscuro(modoOscuro, setModoOscuro) {
  setModoOscuro(!modoOscuro);
  document.body.classList.toggle('dark-mode');
}
