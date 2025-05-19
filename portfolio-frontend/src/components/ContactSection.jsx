import React, { useState } from "react";
import Swal from "sweetalert2";

const ContactSection = () => {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [sending, setSending] = useState(false);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("http://localhost:5000/api/portfolio/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error al enviar el mensaje");
      setForm({ nombre: "", email: "", mensaje: "" });
      Swal.fire({
        icon: "success",
        title: "¡Mensaje enviado!",
        text: "Gracias por contactarme. Te responderé pronto.",
        showConfirmButton: false,
        timer: 1800
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo enviar el mensaje. Inténtalo de nuevo más tarde.",
      });
    }
    setSending(false);
  };

  return (
    <div className="contact-section">
      <h2>¿Interesado en trabajar juntos?</h2>
      <p>Me encantaría colaborar en tu próximo proyecto</p>
      <form className="contact-form" onSubmit={handleSubmit} style={{ maxWidth: 420, margin: "0 auto 2rem auto" }}>
        <input
          type="text"
          name="nombre"
          placeholder="Tu nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          style={{ marginBottom: 12, width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Tu email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ marginBottom: 12, width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <textarea
          name="mensaje"
          placeholder="Tu mensaje"
          value={form.mensaje}
          onChange={handleChange}
          required
          rows={4}
          style={{ marginBottom: 12, width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc", resize: "vertical" }}
        />
        <button className="contact-button" type="submit" disabled={sending} style={{ width: "100%" }}>
          {sending ? "Enviando..." : "Enviar mensaje"}
        </button>
      </form>
      <div className="social-links">
        <a
          href="https://github.com/adrianpe937"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          aria-label="GitHub"
          title="GitHub"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.082-.729.082-.729 1.205.086 1.84 1.236 1.84 1.236 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.3-5.467-1.332-5.467-5.931 0-1.31.467-2.382 1.235-3.22-.123-.303-.535-1.522.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 013.003-.404c1.018.005 2.043.137 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.653 1.654.241 2.873.118 3.176.77.838 1.233 1.91 1.233 3.22 0 4.61-2.807 5.628-5.48 5.922.43.37.823 1.102.823 2.222v3.293c0 .32.218.694.825.576C20.565 21.796 24 17.298 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default ContactSection;
