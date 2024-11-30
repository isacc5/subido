// Validación de formulario de inscripción

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    // Función para validar nombres y campos geográficos
    function validarNombreCampo(valor, esCampoObligatorio = false, maxCaracteres = 30, permitirNumeros = false) {
        // Si está vacío y es obligatorio
        if (esCampoObligatorio && valor.trim() === '') {
            return 'Este campo es obligatorio';
        }
        
        // Si no está vacío
        if (valor.trim() !== '') {
            // Verificar longitud
            if (valor.length > maxCaracteres) {
                return `No puede tener más de ${maxCaracteres} caracteres`;
            }
            
            // Verificar caracteres permitidos
            let regex;
            if (permitirNumeros) {
                // Permitir letras, números, espacios y algunos caracteres de dirección
                regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s#\-\.]+$/;
            } else {
                // Solo letras y espacios
                regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
            }
            
            if (!regex.test(valor)) {
                return permitirNumeros 
                    ? 'Solo se permiten letras, números, espacios y caracteres como #, -, .' 
                    : 'Solo se permiten letras';
            }
        }
        
        return '';
    }

    // Función para validar correo electrónico
    function validarCorreo(correo) {
        if (correo.trim() === '') {
            return 'El correo electrónico es obligatorio';
        }
        
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(correo)) {
            return 'Por favor, ingrese un correo electrónico válido';
        }
        
        return '';
    }

    // Función para validar nombres (primer y segundo nombre/apellido)
    function validarNombre(nombre, esPrimerNombreApellido = false) {
        // Si está vacío y es obligatorio
        if (esPrimerNombreApellido && nombre.trim() === '') {
            return 'Este campo es obligatorio';
        }
        
        // Si no está vacío
        if (nombre.trim() !== '') {
            // Verificar longitud
            if (nombre.length > 30) {
                return 'No puede tener más de 30 caracteres';
            }
            
            // Verificar que solo contenga letras
            const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
            if (!regex.test(nombre)) {
                return 'Solo se permiten letras';
            }
        }
        
        return '';
    }

    // Función para validar fecha de nacimiento
    function validarFecha(fecha, tipoDocumento) {
        const fechaNacimiento = new Date(fecha);
        const fechaActual = new Date();
        
        // Calcular edad
        let edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
        const mes = fechaActual.getMonth() - fechaNacimiento.getMonth();
        
        if (mes < 0 || (mes === 0 && fechaActual.getDate() < fechaNacimiento.getDate())) {
            edad--;
        }
        
        // Validar fecha no mayor a la actual
        if (fechaNacimiento > fechaActual) {
            return 'La fecha de nacimiento no puede ser mayor a la fecha actual';
        }
        
        // Validar consistencia con tipo de documento
        if (tipoDocumento === 'TI' && edad >= 18) {
            return 'La Tarjeta de Identidad no es válida para mayores de edad';
        }
        
        if (tipoDocumento === 'CC' && edad < 16) {
            return 'La Cédula de Ciudadanía no es válida para menores de 16 años';
        }
        
        return '';
    }

    // Función para validar números de documento, teléfono y celular
    function validarNumero(numero, maxDigitos) {
        // Eliminar espacios
        numero = numero.replace(/\s/g, '');
        
        // Verificar que solo contenga números
        const regex = /^[0-9]+$/;
        if (!regex.test(numero)) {
            return 'Solo se permiten números';
        }
        
        // Verificar longitud máxima
        if (numero.length > maxDigitos) {
            return `No puede tener más de ${maxDigitos} dígitos`;
        }
        
        return '';
    }

    // Agregar placeholders de ejemplo
    function agregarPlaceholders() {
        document.getElementById('primer_nombre').placeholder = 'Ej: Juan';
        document.getElementById('segundo_nombre').placeholder = 'Ej: Carlos';
        document.getElementById('primer_apellido').placeholder = 'Ej: Pérez';
        document.getElementById('segundo_apellido').placeholder = 'Ej: Gómez';
        document.getElementById('numero_documento').placeholder = 'Ej: 1234567890';
        document.getElementById('telefono').placeholder = 'Ej: 6781234';
        document.getElementById('celular').placeholder = 'Ej: 3201234567';
        document.getElementById('correo_electronico').placeholder = 'Ej: ejemplo@dominio.com';
        document.getElementById('pais').placeholder = 'Ej: Colombia';
        document.getElementById('ciudad').placeholder = 'Ej: Bogotá';
        document.getElementById('direccion').placeholder = 'Ej: Cra 45 # 123-45';
    }

    // Manejar lógica de discapacidades
    function setupDiscapacidades() {
        const checkboxes = document.querySelectorAll('input[name="discapacidades"]');
        const campoOtra = document.getElementById('campoOtra');
        const otraDiscapacidad = document.getElementById('otraDiscapacidad');
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                // Si se selecciona "Ninguna"
                if (this.id === 'ninguna' && this.checked) {
                    checkboxes.forEach(cb => {
                        if (cb.id !== 'ninguna') {
                            cb.checked = false;
                        }
                    });
                    campoOtra.style.display = 'none';
                    otraDiscapacidad.value = '';
                }
                
                // Si se selecciona otra opción
                if (this.id !== 'ninguna') {
                    document.getElementById('ninguna').checked = false;
                    
                    if (this.id === 'discapacidad_otras') {
                        campoOtra.style.display = this.checked ? 'block' : 'none';
                    } else {
                        // Desmarcar "Otra" y ocultar su campo si no está seleccionada
                        const otraCheckbox = document.getElementById('discapacidad_otras');
                        otraCheckbox.checked = false;
                        campoOtra.style.display = 'none';
                        otraDiscapacidad.value = '';
                    }
                }
            });
        });
    }

    // Mostrar modal de error
    function mostrarModalError() {
        // Crear modal de error
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = 'white';
        modal.style.padding = '20px';
        modal.style.border = '2px solid red';
        modal.style.borderRadius = '10px';
        modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        modal.style.zIndex = '1000';
        modal.innerHTML = `
            <h2 style="color: red; text-align: center;">Error de Validación</h2>
            <p style="text-align: center;">Algunos campos no cumplen con lo solicitado, por favor revisar</p>
            <button onclick="this.closest('div').remove()" style="display: block; margin: 10px auto; padding: 10px;">Cerrar</button>
        `;
        document.body.appendChild(modal);
    }

    // Configurar placeholders al cargar
    agregarPlaceholders();

    // Inicializar configuración de discapacidades
    setupDiscapacidades();

    // Validación al enviar el formulario
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        let isValid = true;

        // Limpiar errores previos
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        // Nuevos campos a validar: país, ciudad, dirección
        const campos = [
            { id: 'pais', obligatorio: true, maxCaracteres: 30, permitirNumeros: false },
            { id: 'ciudad', obligatorio: true, maxCaracteres: 30, permitirNumeros: false },
            { id: 'direccion', obligatorio: true, maxCaracteres: 50, permitirNumeros: true }
        ];

        campos.forEach(campo => {
            const input = document.getElementById(campo.id);
            const errorElement = document.getElementById(`${campo.id}-error`);
            const validacion = validarNombreCampo(
                input.value, 
                campo.obligatorio, 
                campo.maxCaracteres, 
                campo.permitirNumeros
            );
            
            if (validacion) {
                errorElement.textContent = validacion;
                isValid = false;
            }
        });

        // Validar primer nombre
        const primerNombre = document.getElementById('primer_nombre');
        const primerNombreError = document.getElementById('primer_nombre-error');
        const primerNombreValidation = validarNombre(primerNombre.value, true);
        if (primerNombreValidation) {
            primerNombreError.textContent = primerNombreValidation;
            isValid = false;
        }

        // Validar segundo nombre (opcional)
        const segundoNombre = document.getElementById('segundo_nombre');
        const segundoNombreError = document.getElementById('segundo_nombre-error');
        const segundoNombreValidation = validarNombre(segundoNombre.value);
        if (segundoNombreValidation) {
            segundoNombreError.textContent = segundoNombreValidation;
            isValid = false;
        }

        // Validar primer apellido
        const primerApellido = document.getElementById('primer_apellido');
        const primerApellidoError = document.getElementById('primer_apellido-error');
        const primerApellidoValidation = validarNombre(primerApellido.value, true);
        if (primerApellidoValidation) {
            primerApellidoError.textContent = primerApellidoValidation;
            isValid = false;
        }

        // Validar segundo apellido (opcional)
        const segundoApellido = document.getElementById('segundo_apellido');
        const segundoApellidoError = document.getElementById('segundo_apellido-error');
        const segundoApellidoValidation = validarNombre(segundoApellido.value);
        if (segundoApellidoValidation) {
            segundoApellidoError.textContent = segundoApellidoValidation;
            isValid = false;
        }

        // Validar fecha de nacimiento y tipo de documento
        const fechaNacimiento = document.getElementById('fecha_nacimiento');
        const tipoDocumento = document.getElementById('tipo_documento');
        const fechaNacimientoError = document.getElementById('fecha_nacimiento-error');
        const fechaValidation = validarFecha(fechaNacimiento.value, tipoDocumento.value);
        if (fechaValidation) {
            fechaNacimientoError.textContent = fechaValidation;
            isValid = false;
        }

        // Validar número de documento
        const numeroDocumento = document.getElementById('numero_documento');
        const numeroDocumentoError = document.getElementById('numero_documento-error');
        const documentoValidation = validarNumero(numeroDocumento.value, 10);
        if (documentoValidation) {
            numeroDocumentoError.textContent = documentoValidation;
            isValid = false;
        }

        // Validar teléfono
        const telefono = document.getElementById('telefono');
        const telefonoError = document.getElementById('telefono-error');
        if (telefono.value) {
            const telefonoValidation = validarNumero(telefono.value, 7);
            if (telefonoValidation) {
                telefonoError.textContent = telefonoValidation;
                isValid = false;
            }
        }

        // Validar celular
        const celular = document.getElementById('celular');
        const celularError = document.getElementById('celular-error');
        const celularValidation = validarNumero(celular.value, 10);
        if (celularValidation) {
            celularError.textContent = celularValidation;
            isValid = false;
        }

        // Validar correo electrónico
        const correoElectronico = document.getElementById('correo_electronico');
        const correoError = document.getElementById('correo_electronico-error');
        const correoValidation = validarCorreo(correoElectronico.value);
        if (correoValidation) {
            correoError.textContent = correoValidation;
            isValid = false;
        }

        // Validar discapacidad si es "otra"
        const otraDiscapacidad = document.getElementById('discapacidad_otras');
        const campoOtraDiscapacidad = document.getElementById('otraDiscapacidad');
        const discapacidadesError = document.getElementById('discapacidades-error');

        if (otraDiscapacidad.checked) {
            if (campoOtraDiscapacidad.value.trim() === '') {
                discapacidadesError.textContent = 'Por favor, describa su discapacidad';
                isValid = false;
            } else if (campoOtraDiscapacidad.value.length > 30) {
                discapacidadesError.textContent = 'La descripción no puede superar 30 caracteres';
                isValid = false;
            }
        }

        // Si hay errores, mostrar modal
        if (!isValid) {
            mostrarModalError();
            return;
        }

        // Si todo es válido, enviar formulario
        if (!isValid) {
            event.preventDefault();
        } else {
            // Redirect to success page
            event.preventDefault();
            window.location.href = "exito.html";
        }


    });
});