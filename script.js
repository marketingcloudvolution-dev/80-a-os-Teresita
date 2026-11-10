// Invitaciones personalizadas: cada código identifica una familia y sus pases asignados.
const familias = {
  edgar: {
    nombre: "Edgar Borja y Familia",
    adultos: 2,
    ninos: 3
  }
};

const params = new URLSearchParams(window.location.search);
const codigo = (params.get("familia") || "").toLowerCase();
const familia = familias[codigo] || null;

const dialog = document.getElementById("rsvp-dialog");
const form = document.getElementById("rsvp-form");
const adultSelect = document.getElementById("adult-count");
const childSelect = document.getElementById("child-count");
const capacityNote = document.getElementById("capacity-note");

function fillOptions(select, max) {
  select.innerHTML = "";
  for (let i = 0; i <= max; i++) {
    const option = document.createElement("option");
    option.value = String(i);
    option.textContent = String(i);
    select.appendChild(option);
  }
}

function configureFamily() {
  if (!familia) {
    document.getElementById("family-invite").hidden = true;
    document.getElementById("open-rsvp").disabled = true;
    document.getElementById("open-rsvp").textContent = "Invitación no identificada";
    return;
  }

  document.getElementById("family-invite").hidden = false;
  document.getElementById("family-name").textContent = familia.nombre;
  document.getElementById("family-passes").textContent =
    `Pases reservados: ${familia.adultos} adultos y ${familia.ninos} niños`;
  document.getElementById("rsvp-family").textContent =
    `Invitación para ${familia.nombre}`;
  fillOptions(adultSelect, familia.adultos);
  fillOptions(childSelect, familia.ninos);
  adultSelect.value = String(familia.adultos);
  childSelect.value = String(familia.ninos);
  capacityNote.textContent =
    `Tu invitación contempla hasta ${familia.adultos} adultos y ${familia.ninos} niños.`;
}

configureFamily();

document.getElementById("open-rsvp").addEventListener("click", () => {
  if (familia) dialog.showModal();
});
document.getElementById("close-rsvp").addEventListener("click", () => dialog.close());

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!familia) return;

  const name = document.getElementById("guest-name").value.trim();
  const attendance = document.getElementById("attendance").value;
  const adults = Number(adultSelect.value);
  const children = Number(childSelect.value);

  // Segunda validación: nunca permitir superar los pases asignados.
  if (adults > familia.adultos || children > familia.ninos) {
    capacityNote.textContent = "La cantidad supera los pases asignados a esta invitación.";
    return;
  }
  if (attendance.startsWith("Sí") && adults + children < 1) {
    capacityNote.textContent = "Indica al menos una persona si asistirás.";
    return;
  }

  const message = [
    "Hola, confirmo la invitación para los 80 años de Teresita Borja.",
    `Familia: ${familia.nombre}.`,
    `Contacto: ${name}.`,
    `Respuesta: ${attendance}.`,
    `Adultos: ${attendance.startsWith("Sí") ? adults : 0}.`,
    `Niños: ${attendance.startsWith("Sí") ? children : 0}.`,
    "Fecha: sábado 21 de noviembre de 2026, 14:00."
  ].join("\\n");

  // Añade el número receptor de WhatsApp cuando esté definido.
  const whatsappNumber = "";
  const url = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
  dialog.close();
});
