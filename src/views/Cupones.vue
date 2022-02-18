<template>

	<base-layout>

		<div class="temp-cupones container"  v-if="fase_cupon == 0">

			<div class="user-group-button">
				<button class="user-group-button-select" @click="cambiarFase(0,$event)">Cupones por usar</button>
				<button @click="cambiarFase(1,$event)">Utilizados</button>
			</div>

			<div class="grid" style="grid-gap: 10px;" v-if="fase == 0">

				<h1>Cupones por usar</h1>
				
				<div class="grid" style="grid-gap: 10px;">

					<div v-if="cupones_disponibles == null" class="load"></div>
					
					<div class="card card-beneficio-disponible" @click="VerCupon(cupon)"  v-for="cupon in cupones_disponibles" :key="cupon.id">
						
						<div class="grid align-items-center card-img" style="">
							<img :src="host+cupon.url_img" alt="">
						</div>


						<div class="grid">
							<h3 class="font-400"> {{cupon.titulo}} </h3>

							<h3 class="font-400"> {{cupon.nombre_negocio}} </h3>
							<p> {{cupon.tipo_negocio}} </p>

							<h2 v-if="cupon.descuento != null" class="text-green align-self-end font-400">Descuento {{cupon.descuento}}%</h2>
							<h2 v-else class="text-green align-self-end font-400">Precio: S/. {{cupon.precio}} </h2>

						</div>


						<div class="text-center">
							<h3> {{cupon.puntos}} </h3>
							<p>puntos</p>
						</div>

					</div>
					
				</div>

			</div>

			<div class="grid" style="grid-gap: 10px;" v-else>

				<h1>Cupones utilizados</h1>
				
				<div class="grid" style="grid-gap: 10px;">

					<div v-if="cupones_utilizados == null" class="load"></div>

					<div class="card card-beneficio-disponible"  v-for="cupon in cupones_utilizados" :key="cupon.id">
						
						<div class="grid align-items-center card-img" style="">
							<img :src="host+cupon.url_img" alt="">
						</div>


						<div class="grid">
							<h3 class="font-400"> {{cupon.titulo}} </h3>
							<h3 class="font-400"> {{cupon.nombre_negocio}} </h3>
							<p> {{cupon.tipo_negocio}} </p>

							<h2 v-if="cupon.descuento != null" class="text-green align-self-end font-400">Descuento {{cupon.descuento}}%</h2>
							<h2 v-else class="text-green align-self-end font-400">Precio: S/. {{cupon.precio}} </h2>

						</div>


						<div class="text-center">
							<h3> {{cupon.puntos}} </h3>
							<p>puntos</p>
						</div>

					</div>
					
				</div>

			</div>
			
		</div>

	</base-layout>
	
	<ShowCupon @Return="Return" :cupon="cupon" v-if="fase_cupon == 1" />

</template>

<script>
	import axios from 'axios';
	import $ from 'jquery';
	import ShowCupon from '@/componentes/ShowCupon.vue';
	//import EasyPieChart from "easy-pie-chart";

	export default{

		components: {
			ShowCupon
		},

		created(){
			this.usuario = JSON.parse(localStorage.getItem('usuario'));

			this.CargarCuponDisponible();
			this.CargarCuponUtilizado();
		},
		data(){
			return{
				//CARGA
				cupones_disponibles:null,
				cupones_utilizados:null,

				//GESTION
				usuario:null,
				cupon:null,
				//CONROL
				fase: 0,
				fase_cupon:0,
				host:process.env.VUE_APP_HOST,
				api: process.env.VUE_APP_API	
			}
		},
		methods:{

		//CARGA===============================================
			async CargarCuponDisponible(){
				const params={
					id: this.usuario.id
				}
				await axios.post(process.env.VUE_APP_API+'GetBeneficioDisponible', params).then(response=>{
					console.log(response.data);
					this.cupones_disponibles = response.data;
				});
			},
			async CargarCuponUtilizado(){
				const params={
					id: this.usuario.id
				}
				await axios.post(process.env.VUE_APP_API+'GetBeneficioUtilizados', params).then(response=>{
					console.log(response.data);
					this.cupones_utilizados = response.data;
				});
			},

		//FUNCIONES======================================================

			VerCupon(cupon){
				this.cupon = cupon;
				this.fase_cupon = 1;
				this.$emit('footer', 0)
			},

		//CONTROL==============================================================
			Return(){
				this.fase_cupon = 0;
				this.$emit('footer', 1)
			},
			cambiarFase:function(fase,$event){
				this.fase = fase;
				console.log($event);
				$('.user-group-button-select').removeClass('user-group-button-select');
				$($event.target).addClass('user-group-button-select');
			}

		},
		mounted(){

		}
	}	

</script>

