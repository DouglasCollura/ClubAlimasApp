<template>
<base-layout>
<div class="container grid" > 
    
    <button @click="this.$emit('Return')" class="back-button back-button-green icon-arrow-back align-self-start justify-self-start"></button>


    <div class="container grid align-content-start justify-items-center" style="grid-gap: 20px; padding: 10px;">
    
        <h1 class="font-400 text-center text-green">¡Cupón generado! ¡Y listo para usar!</h1>


        <div class="QR-container">
            <vueQr :text="'http://programa.calimas.pe/'+'Canje/'+cupon.cod_qr" :size="200"></vueQr>
        </div>

        <div class="card-cupon-valor" style="justify-self: stretch;">
            <h2 v-if="cupon.descuento != null" class="text-green align-self-end font-400">Descuento: {{cupon.descuento}}%</h2>
			<h2 v-else class="text-green align-self-end font-400">Precio: S/. {{cupon.precio}} </h2>
        </div>


        <div class="section-cupon-img" style="justify-self: stretch;">
            
            <div class="grid justify-self-center align-self-start card-img" style="width:80px;height:80px">
				<img :src="host+cupon.url_img" alt="">
            </div>

            <div class="grid" style="grid-gap: 20px;">
                <h3 class="font-400"> {{cupon.titulo}} </h3>
                <h3 class="font-400"> {{cupon.nombre_negocio}} </h3>
                <h3><i class="icon-locacion text-green"></i> {{cupon.direccion}} </h3>
                <h3><i class="icon-telefono text-green"></i> {{cupon.telefono}} </h3>

            </div>

        </div>

        <div class="card-cupon-valor" style="justify-self: stretch;">
            <h2 class="text-center">Vencimiento: {{cupon.fecha_hasta.split("-").reverse().join("-")}} </h2>
        </div>

    </div>

</div>
</base-layout>
  
</template>

<script>
//import axios from 'axios';
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
export default {
    
    components: {vueQr},
    
    data() {
        return {

            //GESTION
            //CONTROL
            fase:0,
			host:process.env.VUE_APP_HOST

        }
    },
    props: {
        cupon: {
            type: Object,
            default: null
        },

    },
    created () {
        console.log(this.cupon);
    },

    methods: {



    },


}
</script>
