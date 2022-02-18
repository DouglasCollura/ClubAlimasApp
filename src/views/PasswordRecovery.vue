<template>

	<base-layout>

		<div class="container temp-login">
			
			<div class="section-login-top">
				<ion-img :src="require('../img/alimas-logo-min.png')"></ion-img>
			</div>

			<div class="section-login-body">

				<!-- FASE 1 -->
				<div class="grid  align-content-start" style="grid-gap: 10px;" v-show="fase == 0">
					<h1 class="font-400 text-center">¿Olvidaste tu contraseña?</h1>
					<h3 class="font-300 text-center">Te ayudamos a recuperarla. Completa tu correo electrónico y te enviaremos las indicaciones para restrablecerla.</h3>					
				</div>

				<div class="grid justify-items-center" style="grid-gap: 20px;" v-show="fase == 0">
					<input type="text" v-model="correo" placeholder="Correo electrónico">

					<button class="btn btn-secondary" @click="EnviarCorreo">ACEPTAR</button>

				</div>

				<div class="grid justify-items-center align-self-end" style="grid-gap: 10px;" v-show="fase == 0">
					<p>¿No tienes e-mail? </p>
					<button class="btn-clave-rec">Recupera tu contraseña haciendo click aquí</button>
				</div><!--FIN FASE 1 -->


				<!-- FASE 2 -->
				<div class="grid  align-content-start" style="grid-gap: 10px;" v-show="fase == 1">
					<h1 class="font-400 text-center">¡Ya casi terminamos!</h1>
					<h3 class="font-300 text-center">Introduce la contraseña provisoria que enviamos a tu correo.</h3>					
				</div>

				<div class="grid justify-items-center" style="grid-gap: 20px;" v-show="fase == 1">
					<input type="text" v-model="clave" placeholder="Contraseña provisoria">

					<button class="btn btn-secondary" @click="VerificarClave">ACEPTAR</button>

				</div><!--FIN FASE 2 -->


				<!-- FASE 3 -->
				<div class="grid  align-content-start" style="grid-gap: 10px;" v-show="fase ==2">
					<h1 class="font-400 text-center">Ingresa una nueva contraseña</h1>
				</div>

				<div class="grid justify-items-center align-content-start" style="grid-gap: 20px;" v-show="fase == 2">
					<input type="password" v-model="n_clave" placeholder="Contraseña">

					<input type="password" v-model="n_clave_rep" placeholder="Repetir contraseña">

					<button class="btn btn-secondary" @click="CambiarClave" >ACEPTAR</button>

				</div><!--FIN FASE 3 -->

			</div>

		</div>

	</base-layout>

</template>

<script>
	import axios from 'axios';
	//import $ from 'jquery';
	import { IonImg } from '@ionic/vue';

	export default{

		components: {
			IonImg 
		},

		created(){

		},
		data(){
			return{
				
				//GESTION
				id:null,
				correo:null,
				clave:null,
				n_clave:null,
				n_clave_rep:null,
				//CONTROL
				fase:0,

			}
		},
		methods:{

			async EnviarCorreo(){

				const params={
					correo:this.correo
				}

				this.$swal.fire({
					title:'Verificando...',
					allowOutsideClick: false,
					width: 400,
					showConfirmButton:false,
				});
				this.$swal.showLoading();
				await axios.post(process.env.VUE_APP_API+'EnviarCorreo',params).then(response=>{
					this.$swal.close();
					if(response.data != 0){
						this.id = response.data.id;
						this.fase = 1;
					}else{
						this.$swal.fire({
							icon:'error',
							title:'El correo no existe!',
							width:400
						});
					}

				});
			},

			async VerificarClave(){
				this.$swal.fire({
					title:'Verificando...',
					allowOutsideClick: false,
					width: 400,
					showConfirmButton:false,
				});
				this.$swal.showLoading();
			
				const params = {
					id:this.id,
					clave:this.clave
				}

				await axios.post(process.env.VUE_APP_API+'VerificarClave',params).then(response=>{
					this.$swal.close();
					if(response.data != 0){
						this.fase = 2;
					}else{
						this.$swal.fire({
							icon:'error',
							title:'La clave no es correcta, verifique e intente de nuevo.',
							width:400
						});
					}

				});
			},

			async CambiarClave(){
				if(this.n_clave != this.n_clave_rep){
					this.$swal.fire({
						icon:'error',
						title:'Las contraseñas no coinciden',
						width:400
					});
				}else{
					const params ={
						clave:this.n_clave,
						id:this.id
					}
					this.$swal.fire({
						title:'Cambiando contraseña.',
						allowOutsideClick: false,
						width: 400,
						showConfirmButton:false,
					});
					this.$swal.showLoading();
					await axios.post(process.env.VUE_APP_API+'CambiarClave',params).then(()=>{
						this.$swal.close();
						this.$swal.fire({
							position: 'top-end',
							icon: 'success',
							title: 'Tu contraseña ha sido modificada con éxito!',
							showConfirmButton: false,
							timer: 1500
						})
						this.$router.replace('/Login');

					});
				}
			}

		}

	}	

</script>

