document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("token");
  const esAdmin = token && token.trim() !== "";

  const formularioSection = document.getElementById("formularioPresupuesto");
  const tablaSection = document.getElementById("tablaPresupuestos");
  const adminButtons = document.getElementById("adminButtons");
  const form = document.getElementById("presupuestoForm");
  const resultadoDiv = document.getElementById("resultadoPresupuesto");
  const tablaBody = document.getElementById("tablaPresupuestosBody");

  // Mostrar u ocultar según el tipo de usuario
  if (esAdmin) {
    tablaSection.classList.remove("d-none");
    adminButtons.classList.remove("d-none");
    mostrarPresupuestosEnTabla();
  } else {
    formularioSection.classList.remove("d-none");
    tablaSection?.remove();      // elimina completamente si no sos admin
    adminButtons?.remove();      // elimina botones si no sos admin
  }

  function sumatoria(servicios) {
    return servicios.reduce((acc, val) => acc + val, 0);
  }

  function calcularPresupuesto(salon, servicios) {
    return salon + sumatoria(servicios);
  }

  function guardarPresupuesto(presupuesto) {
    let historial =
      JSON.parse(localStorage.getItem("historialPresupuestos")) || [];
    historial.push(presupuesto);
    localStorage.setItem("historialPresupuestos", JSON.stringify(historial));
  }

  function mostrarPresupuestosEnTabla() {
    let historial =
      JSON.parse(localStorage.getItem("historialPresupuestos")) || [];
    tablaBody.innerHTML = "";
    historial.forEach((p) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${p.id}</td>
        <td>${p.nombreCompleto}</td>
        <td>${p.fecha}</td>
        <td>${p.tematica}</td>
        <td><ul>${p.serviciosSeleccionados.map((s) => `<li>${s}</li>`).join("")}</ul></td>
        <td>$${p.valorTotal.toLocaleString()}</td>
      `;
      tablaBody.appendChild(fila);
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value.trim();
      const salonSelect = document.getElementById("salon");
      const salonPrecio = parseInt(salonSelect.value);
      const salonNombre = salonSelect.options[salonSelect.selectedIndex].text;

      const serviciosCheckbox = document.querySelectorAll(
        'input[type="checkbox"]:checked'
      );
      const servicios = [];
      const serviciosNombres = [];

      serviciosCheckbox.forEach((chk) => {
        servicios.push(parseInt(chk.value));
        serviciosNombres.push(chk.parentElement.textContent.trim());
      });

      const totalPresupuesto = calcularPresupuesto(salonPrecio, servicios);

      const presupuesto = {
        id: Date.now(),
        nombreCompleto: nombre,
        fecha: new Date().toLocaleString(),
        tematica: salonNombre,
        serviciosSeleccionados: serviciosNombres,
        valorTotal: totalPresupuesto,
      };

      guardarPresupuesto(presupuesto);

      resultadoDiv.innerHTML = `
        <h3>Presupuesto para ${nombre}</h3>
        <p><strong>Salón seleccionado:</strong> ${salonNombre}</p>
        <p><strong>Servicios adicionales:</strong></p>
        <ul>${
          serviciosNombres.length > 0
            ? serviciosNombres.map((s) => `<li>${s}</li>`).join("")
            : "<li>Sin servicios adicionales</li>"
        }</ul>
        <p><strong>Total final:</strong> $${totalPresupuesto.toLocaleString()}</p>
        <p><em>¡Presupuesto guardado correctamente!</em></p>
        <p><em>Gracias por elegirnos.</em></p>
      `;

      form.reset();
    });
  }
});
