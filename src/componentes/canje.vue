<template>
<base-layout>
<div class="container grid" > 
			
    <div class="grid" v-show="fase == 0" >
        <div class="temp-cupon">
                <button @click="this.$emit('Return')" class="back-button back-button-green icon-arrow-back align-self-start justify-self-start"></button>

                <div class="section-cupon-img">

                    <div class="img-cupon card-img" style="width:80px; height:80px">
                        <img :src="host+cupon.url_img" alt="">
                    </div>

                    <div>
                        <h1 class="text-green font-300" style="word-break: break-word;"> {{cupon.titulo}}</h1>

                        <h2 class="text-green font-400"> {{cupon.nombre_negocio}} </h2>

                        <h3 class="font-400"> {{cupon.tipo_negocio}} </h3>
                    </div>

                </div>
                <div class="grid gc-2x-g">
                    <div>
                        <h3><i class="icon-locacion text-green"></i> {{cupon.direccion}} </h3>
                    </div>

                    <div class="justify-self-center">
                        <h2 ><i class="icon-telefono text-green"></i> {{cupon.telefono}} </h2>
                    </div>
                </div>


                <div class="card-cupon-valor">
                    <h1 class="text-center">Valor en puntos: {{cupon.puntos}} </h1>
                </div>	

                <div class="grid" id="content-text" style="grid-gap:10px">
                    <h2 class="text-orange font-400">Descripción:</h2>
                    <span class="text">
                        {{cupon.descripcion}}
                    </span>
                </div>	

                <div class="info-cupon">
                    <h2 class="text-orange font-400">¿Cómo uso este cupón?</h2>

                    <h3 class="font-400">Presiona el botón de canjear puntos. De esa forma estarás canjeando puntos por el cupón. Una vez realizado esto, se generará un código para que utilices en el comercio.</h3 >
                </div>			
        </div>

        <div class="section-cupon-footer">
            <h3 class="font-300">Válido por</h3>

            <h2 v-if="cupon.descuento != null" class="text-green align-self-end font-400 text-center" style="font-size:40px"> {{cupon.descuento}}% de descuento</h2>
			<h2 v-else class="text-green align-self-end font-400 text-center" style="font-size:40px"> S/. {{cupon.precio}} de descuento </h2>

            <button class="btn btn-secondary" @click="fase = 1">CANJEAR PUNTOS</button>
        </div>
    </div>


    <div v-show="fase == 1" class="grid align-content-center justify-items-center" style="padding: 20px;grid-gap: 30px;" >
        
        <h1 class="text-center font-400">Estas por cambiar {{cupon.puntos}} puntos por el cupón ¿Deseas continuar?</h1>

        <div class="grid justify-items-center" style="grid-gap: 15px;">
            <button class="btn btn-primary" @click="Insert">SI</button>
            <button class="btn btn-secondary" @click="fase = 0">NO</button>					
        </div>

    </div>


    <div v-if="fase == 2" class="container grid align-content-start justify-items-center" style="grid-gap: 20px; padding: 10px;">
    
        <button  @click="this.$emit('Return')"  class="back-button text-orange icon-close align-self-start justify-self-end"></button>

        <h1 class="font-400 text-center text-green">¡Cupón generado! ¡Y listo para usar!</h1>


        <div class="QR-container">
            <vueQr :text="'http://programa.calimas.pe/'+'Canje/'+cod_qr" :size="200"></vueQr>
        </div>

        <div class="card-cupon-valor text-center" style="justify-self: stretch;">
            <h2 v-if="cupon.descuento != null" class="text-green align-self-end font-400"> {{cupon.descuento}}% de descuento</h2>
			<h2 v-else class="text-green align-self-end font-400">S/. {{cupon.precio}}  de descuento</h2>
        </div>


        <div class="section-cupon-img" style="justify-self: stretch;">
            
            <div class="grid justify-self-center align-self-start card-img" style="width:80px;height:80px">
				<img :src="host+cupon.url_img" alt="">
            </div>

            <div class="grid" style="grid-gap: 20px;">
				<h3> {{cupon.titulo}} </h3>

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
import axios from 'axios';
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
export default {
    
    components: {vueQr},
    
    data() {
        return {

            //GESTION
            cod_qr:null,

            //CONTROL
            fase:0,
            host:process.env.VUE_APP_HOST,
			api: process.env.VUE_APP_API
        }
    },
    props: {
        cupon: {
            type: Object,
            default: null
        },
        id_usuario:{type:Number, default:null},
        puntos:{type:Number, default:null},
        documento:{type:Number, default: null}
    },
    created () {
        console.log(this.cupon);
    },

    methods: {

        async Insert(){
            this.$swal.fire({
                title:'Generando...',
                allowOutsideClick: false,
                width: 400,
                showConfirmButton:false,
            });

            const params={
                fecha_hasta:this.cupon.fecha_hasta,
                id_beneficio: this.cupon.id,
                id_usuario: this.id_usuario,
                documento: this.documento,
                cod_qr:this.cupon.cod_qr,
                puntos:(this.puntos - this.cupon.puntos),
                cupon_puntos:this.cupon.puntos
            }

			await axios.post(process.env.VUE_APP_API+'InsertBeneficioCtrl', params).then(response=>{
                this.cod_qr = response.data;
                this.fase=2;
				this.$swal.close();
                this.$emit('UpdatePuntos',params.puntos, this.cupon.puntos);
            });
        }

    },
    mounted () {

    }

}
</script>
