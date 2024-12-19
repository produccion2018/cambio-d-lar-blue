// URL de la API para obtener el cambio del dólar blue
const apiUrl = 'https://api.bluelytics.com.ar/v2/latest';

// Función para obtener el tipo de cambio
async function getExchangeRates() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener las tasas de cambio:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al obtener las tasas de cambio.',
        });
    }
}

// Función para realizar la conversión de moneda
async function convertCurrency() {
    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;

    if (!amount || isNaN(amount) || amount <= 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Entrada inválida',
            text: 'Por favor ingresa una cantidad válida.',
        });
        return;
    }

    // Obtener tasas de cambio
    const rates = await getExchangeRates();

    if (rates) {
        let conversionRate;

        // Si la moneda de destino es Peso Argentino (ARS), usaremos el tipo de cambio del dólar blue
        if (toCurrency === "ARS") {
            switch (fromCurrency) {
                case 'USD':
                    conversionRate = rates.blue.value_sell; // Dólar Blue a Peso Argentino
                    break;
                case 'EUR':
                    conversionRate = rates.blue.value_sell * rates.euro.value_sell; // Euro a Peso Argentino
                    break;
                case 'GBP':
                    conversionRate = rates.blue.value_sell * rates.gbp.value_sell; // Libra Esterlina a Peso Argentino
                    break;
                case 'COP':
                    conversionRate = rates.blue.value_sell * rates.cop.value_sell; // Peso Colombiano a Peso Argentino
                    break;
                case 'MXN':
                    conversionRate = rates.blue.value_sell * rates.mxn.value_sell; // Peso Mexicano a Peso Argentino
                    break;
                case 'BRL':
                    conversionRate = rates.blue.value_sell * rates.brl.value_sell; // Real Brasileño a Peso Argentino
                    break;
                case 'CLP':
                    conversionRate = rates.blue.value_sell * rates.clp.value_sell; // Peso Chileno a Peso Argentino
                    break;
                case 'PEN':
                    conversionRate = rates.blue.value_sell * rates.pen.value_sell; // Nuevo Sol Peruano a Peso Argentino
                    break;
                default:
                    Swal.fire({
                        icon: 'error',
                        title: 'Moneda no soportada',
                        text: 'La moneda seleccionada no es soportada.',
                    });
                    return;
            }
        }

        const result = amount * conversionRate;
        document.getElementById('result').innerText = `Resultado: ${result.toFixed(2)} ${toCurrency}`;

        Swal.fire({
            icon: 'success',
            title: 'Conversión exitosa',
            text: `El resultado es ${result.toFixed(2)} ${toCurrency}`,
        });
    }
}

// Función para limpiar los campos y resultados
function clearFields() {
    document.getElementById('amount').value = '';  // Limpiar el campo de cantidad
    document.getElementById('from-currency').value = 'USD';  // Restablecer la moneda de origen
    document.getElementById('to-currency').value = 'ARS';  // Restablecer la moneda de destino
    document.getElementById('result').innerText = '';  // Limpiar el resultado
}

// Asignar el evento al botón de eliminar
document.getElementById('clear-button').addEventListener('click', clearFields);
