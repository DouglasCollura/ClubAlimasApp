<template>

	<base-layout>

		<div class="container">

			<div class="header-notif">
				<button @click="$router.go(-1)" class="back-button back-button-green icon-arrow-back align-self-start justify-self-start"></button>
			</div>

			<div class="grid" v-if="notificaciones == null">
				<div  class="load"></div>
			</div>

			<div class="card-notif" v-for="notificacion in notificaciones" :key="notificacion.id">

				<div class="title-card-notif">
					<h3 class="text-green font-400"> {{notificacion.titulo}} </h3>
					<h3 :class="notificacion.visto == '1' ? 'font-600 justify-self-end':'font-300 justify-self-end'"> {{notificacion.fecha.split("-").reverse().join("-")}} </h3>
				</div>

				<h3 :class="notificacion.visto == '1' ?'body-card-notif font-600' :'body-card-notif' " @click="GoToBrowser(notificacion.descripcion)"> {{notificacion.descripcion}} </h3>
				
			</div>
			
		</div>

	</base-layout>

</template>

<script>
	import axios from 'axios';
	import { Browser } from '@capacitor/browser';
	//import $ from 'jquery';
	//import EasyPieChart from "easy-pie-chart";

	export default{


		data(){
			return{
				//CARGA
				notificaciones:[],

				//CONTROL

			}
		},
		created(){
			this.CargarNotificacion();
			
		},
		methods:{

			//CARGA
			async CargarNotificacion(){
				const params = {
					id: JSON.parse(localStorage.getItem('usuario')).id
				}
				this.notificaciones = null;
				await axios.post(process.env.VUE_APP_API+'GetNotificacionUser',params).then(response=>{
					console.log(response.data);
					this.notificaciones = response.data;
				});
			},

			GoToBrowser(texto){
				const indexHttp = texto.search("http");

				if(indexHttp != -1){
					const indexSpace = texto.search(" ");

					if(indexSpace > indexHttp){
						texto =  texto.substring(indexHttp, indexSpace);
						Browser.open({ url: texto });

					}else{
						texto =  texto.substring(indexHttp, texto.lenght)
						Browser.open({ url: texto });
					}

				}
			}

		},
		mounted(){

		}
	}	

</script>

