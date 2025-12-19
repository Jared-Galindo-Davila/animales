document.addEventListener("DOMContentLoaded", function() {
    document.body.classList.add('loaded');

    if (document.getElementById("tablaAnimales")) {
        actualizarTotalAnimales();
    }

    document.getElementById('agregarBtn').addEventListener('click', function() {
        const select = document.getElementById('nombreAnimal');
        const opcionSeleccionada = select.options[select.selectedIndex];

        const nombre = opcionSeleccionada.value;
        const peso = opcionSeleccionada.getAttribute('data-peso');
        const comida = opcionSeleccionada.getAttribute('data-comida');
        const tipo = opcionSeleccionada.getAttribute('data-tipo');

        if (!nombre) {
            alert('Por favor, seleccione un animal.');
            return;
        }

        const tabla = document.getElementById('tablaAnimales').getElementsByTagName('tbody')[0];
        const nuevaFila = tabla.insertRow();

        const celdaID = nuevaFila.insertCell(0);
        const celdaNombre = nuevaFila.insertCell(1);
        const celdaPeso = nuevaFila.insertCell(2);
        const celdaComida = nuevaFila.insertCell(3);
        const celdaTipo = nuevaFila.insertCell(4);
        const celdaAcciones = nuevaFila.insertCell(5);

        celdaID.textContent = tabla.rows.length;
        celdaNombre.textContent = nombre;
        celdaPeso.textContent = peso;
        celdaComida.textContent = comida;
        celdaTipo.textContent = tipo;

        celdaAcciones.innerHTML = `
            <button class="editarBtn">Editar</button>
            <button class="eliminarBtn">Eliminar</button>
        `;

        asignarEventosBotones(nuevaFila);
        actualizarTotalAnimales();
    });

    document.getElementById('generarPdfBtn').addEventListener('click', generarZoo);
});

function asignarEventosBotones(fila) {
    const editarBtn = fila.querySelector('.editarBtn');
    const eliminarBtn = fila.querySelector('.eliminarBtn');

    editarBtn.addEventListener('click', function() {
        const nuevoComida = prompt('Editar comida:', fila.cells[3].textContent);

        if (nuevoComida !== null) fila.cells[3].textContent = nuevoComida;
    });

    eliminarBtn.addEventListener('click', function() {
        if (confirm('¿Estás seguro de eliminar esta fila?')) {
            fila.remove();
            actualizarTotalAnimales();
        }
    });
}

function actualizarTotalAnimales() {
    const totalAnimales = document.getElementById('tablaAnimales').getElementsByTagName('tbody')[0].rows.length;
    document.getElementById('totalAnimales').innerText = totalAnimales;
}

function generarZoo() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    const tabla = document.getElementById('tablaAnimales').getElementsByTagName('tbody')[0];
    const filas = tabla.rows;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Gestión de Animales del Zoo", 148.5, 10, null, null, "center");

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Reporte de Animales del zoo", 148.5, 16, null, null, "center");

    doc.line(10, 20, 287, 20);

    let y = 30;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("ID", 10, y);
    doc.text("Nombre", 30, y);
    doc.text("Peso", 80, y);
    doc.text("Comida", 130, y);
    doc.text("Tipo", 180, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    for (let i = 0; i < filas.length; i++) {
        const celdas = filas[i].cells;

        if (y > 190) {
            doc.addPage('landscape', 'a4');
            y = 30;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.text("ID", 10, y);
            doc.text("Nombre", 30, y);
            doc.text("Peso", 80, y);
            doc.text("Comida", 130, y);
            doc.text("Tipo", 180, y);
            y += 10;
        }

        doc.text(`${celdas[0].textContent}`, 10, y);
        doc.text(`${celdas[1].textContent}`, 30, y);
        doc.text(`${celdas[2].textContent}`, 80, y);
        doc.text(`${celdas[3].textContent}`, 130, y);
        doc.text(`${celdas[4].textContent}`, 180, y);
        y += 10;
    }

    let totalAnimales = filas.length;
    y += 10;

    if (y > 190) {
        doc.addPage('landscape', 'a4');
        y = 30;
    }

    doc.setFont("helvetica", "bold");
    doc.text(`Total de Animales: ${totalAnimales}`, 10, y);

    doc.save("zoo.pdf");
}
