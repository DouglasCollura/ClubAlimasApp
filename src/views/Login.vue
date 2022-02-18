<template>

	<ion-page>
		<ion-content>

			<div class="container temp-login">
				
				<div class="section-login-top">
					<ion-img :src="require('../img/alimas-logo-min.png')"></ion-img>
				</div>
				<div class="section-login-body">
					<h1 class="font-400 text-center">Inicia sesión y comienza a canejar tus puntos</h1>

					<div class="grid align-content-start " style="grid-gap: 20px;">
						<input type="text" placeholder="RUC / DNI" v-model="usuario.dni">

						<input type="password" placeholder="Contraseña" v-model="usuario.clave">	

						<div class="grid justify-items-center">
							<p class="font-300">¿Olvidaste tu contraseña?</p> 			
							<button class="btn-clave-rec" @click="this.$router.push('/PassRecovery')">Recuperala aquí</button>
						</div>
					</div>

					<div class="grid justify-items-center align-self-end" style="grid-gap: 10px;">

						<button class="btn btn-secondary" @click="Login()">INICIAR SESIÓN</button>

						<div >
							<p style="display: inline-block;">¿No tienes cuenta?</p>
							<button class="btn-clave-rec" @click="$router.push('/SignUp')">Registrate</button>
						</div>
					</div>
				</div>

			</div>
		</ion-content>

	</ion-page>


</template>

<script>
	import axios from 'axios';
	//import $ from 'jquery';
	import { IonImg, IonPage, IonContent } from '@ionic/vue';

	export default{

		components: {
			IonPage,
			IonContent,
			IonImg 
		},

		created(){
			this.usuario.token = sessionStorage.getItem('token');
		},
		data(){
			return{
				
				usuario:{
					dni:null,
					clave:null,
					token:null
				},

				//VAR CONTROL
				fase_beneficio:0,
				router:null
			}
		},
		methods:{
			Login:async function(){
				console.log(this.usuario);
				if(await this.Vacio(this.usuario)){
					return 0;
				}

				this.$swal.fire({
					title:'Verificando...',
					allowOutsideClick: false,
					width: 400,
					showConfirmButton:false,
				});
				this.$swal.showLoading();

				this.router = this.$router;
				await axios.post(process.env.VUE_APP_API+'Login',this.usuario).then(response=>{
					this.$swal.close();
					if(response.data == 0){
						this.$swal.fire({
							icon:'error',
							title:'Usuario o Contraseña no existen!',
							width:400
						});
					}else{
						this.usuario = this.Limpiar(this.usuario);
						localStorage.setItem('usuario', JSON.stringify(response.data[0]));
						this.router.replace('/user');
					}
				});

			},

			//FUNCIONES DE CONTROL

			Vacio:function(datas){
				for (const [key, value] of Object.entries(datas)) {
					console.log(key);
					if(value == '' || value == null){
						this.$swal.fire({
							icon:'error',
							title:'Complete todos los campos',
							width:400
						});
						return true;
					}
				}
			},
			Limpiar:function(datas){
				var obj = {};
				for (var propName in datas) {
					obj[propName] = null;
				}
				return obj;
			}

		}

	}	

</script>

