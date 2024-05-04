window.onload = function() {
    document.getElementById('dividir').addEventListener('change', function() {
        let personasDiv = document.getElementById('personasDiv');
        personasDiv.style.display = this.checked ? 'block' : 'none';
    });

    document.getElementById('calculadora').addEventListener('submit', function(event) {
        event.preventDefault();

        let monto = parseFloat(document.getElementById('monto').value);
        let porcentaje = parseFloat(document.getElementById('porcentaje').value);
        let personas = parseInt(document.getElementById('personas').value);
        let redondear = document.getElementById('redondear').value;
        let dividirCuenta = document.getElementById('dividir').checked;

        // Validar que monto y porcentaje sean números positivos
        if (monto <= 0 || porcentaje < 0) {
            alert("Ingrese valores válidos para monto y porcentaje (números positivos).");
            return;
        }

        let propina = porcentaje / 100 * monto;
        if (redondear === 'arriba') {
            propina = Math.ceil(propina);
        } else if (redondear === 'abajo') {
            propina = Math.floor(propina);
        }

        let total = monto + propina;
        let totalPorPersona = dividirCuenta ? total / personas : total; // Si se divide la cuenta, calcular el total por persona

        document.getElementById('propina').textContent = propina.toFixed(2);
        document.getElementById('total').textContent = total.toFixed(2);
        document.getElementById('totalPorPersona').textContent = dividirCuenta ? (personas > 0 ? totalPorPersona.toFixed(2) : '-') : '';

        // Guardar los datos en el almacenamiento local
        let facturas = JSON.parse(localStorage.getItem('facturas')) || [];
        facturas.push({
            monto: monto,
            porcentaje: porcentaje,
            personas: personas,
            redondear: redondear,
            dividirCuenta: dividirCuenta,
            propina: propina,
            total: total,
            totalPorPersona: totalPorPersona
        });
        localStorage.setItem('facturas', JSON.stringify(facturas));

        mostrarFacturas();
    });

    document.getElementById('mostrarFacturas').addEventListener('click', function() {
        mostrarFacturas();
    });

    function mostrarFacturas() {
        let facturas = JSON.parse(localStorage.getItem('facturas')) || [];
        let facturasDiv = document.getElementById('facturas');
        facturasDiv.innerHTML = '';
        for (let i = 0; i < facturas.length; i++) {
            let factura = facturas[i];
            let p = document.createElement('p');
            let texto = `Factura ${i + 1}: Monto de la cuenta ${factura.monto}, Porcentaje de la propina ${factura.porcentaje}, Redondear ${factura.redondear}, Dividir cuenta ${factura.dividirCuenta ? 'Sí' : 'No'}, Monto de la propina ${factura.propina.toFixed(2)}, Total a pagar ${factura.total.toFixed(2)}`;
            if (factura.dividirCuenta) {
                texto += factura.personas > 0 ? `, Total por persona ${factura.totalPorPersona.toFixed(2)}` : ', No se puede dividir la cuenta.';
            }
            p.textContent = texto;
            facturasDiv.appendChild(p);
            // Botón para borrar esta factura individualmente
            let btnBorrar = document.createElement('button');
            btnBorrar.textContent = 'Borrar';
            btnBorrar.addEventListener('click', function() {
                facturas.splice(i, 1);
                localStorage.setItem('facturas', JSON.stringify(facturas));
                mostrarFacturas();
            });
            facturasDiv.appendChild(btnBorrar);
        }
        // Botón para vaciar todo el historial
        let btnVaciar = document.createElement('button');
        btnVaciar.textContent = 'Vaciar historial';
        btnVaciar.addEventListener('click', function() {
            localStorage.removeItem('facturas');
            facturasDiv.innerHTML = '';
        });
        facturasDiv.appendChild(btnVaciar);
        facturasDiv.style.display = 'block'; // Mostrar las facturas guardadas cuando se hace clic en el botón
    }
}
