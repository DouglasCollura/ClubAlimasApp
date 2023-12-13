export const decimalNumberMixin = {
  computed: {
    numeroFormateado: () => (valor, cantidadDecimales = 0) => {
          // Verifica si el valor es un número antes de continuar
          if (typeof valor !== 'number' || isNaN(valor)) {
            return 'Valor no válido';
          }
    
          // Redondea el valor a la cantidad de decimales especificada
          const redondeado = Math.round(valor * Math.pow(10, cantidadDecimales)) / Math.pow(10, cantidadDecimales);
    
          // Convierte el número a cadena y divide en parte entera y decimal
          const [parteEntera, parteDecimal] = redondeado.toString().split('.');
    
          // Formatea la parte entera con comas
          const parteEnteraFormateada = parteEntera.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
          // Devuelve el número formateado
          return parteEnteraFormateada + (parteDecimal ? '.' + parteDecimal : '');
        },
  },
};