<template>

	<base-layout>
	<transition name="fade" mode="out-in" >		
		<div class="container grid justify-items-center" style="padding: 0px 10px;"  v-if="fase != 3">
			<button class="btn-top-signup" v-show="fase !=2" @click="fase = 3">OMITIR</button>
			<button class="btn-top-signup" v-show="fase == 2"  @click="$router.push('/Login')">CANCELAR</button>
			
			<transition name="fade" mode="out-in">
				<div class="grid justify-items-center" v-if="fase == 0">
					<h1 class="text-center" >¡Registrate y comienza a sumar puntos!</h1>
					<img  src="../img/signup/img_1.svg" alt="">
				</div>

				<div class="grid justify-items-center" v-else-if="fase == 1">
					<h1 class="text-center" >Compra en www.alimasperu.com y suma puntos</h1>
					<img  src="../img/signup/img_2.svg" alt="">
				</div>

				<div class="grid justify-items-center" v-else>
					<h1 class="text-center" >¡Canjea tus puntos por beneficios exclusivos!</h1>
					<img  src="../img/signup/img_3.svg" alt="">
				</div>

			</transition>
			<button class="btn btn-primary" v-show="fase !=2" @click="cambiarFase()">CONTINUAR</button>
			<button class="btn btn-primary" v-show="fase == 2" @click="cambiarFase()">COMENZAR</button>
		</div>

		<div class="container temp-signup" v-else>

			<div class="section-signup-top">

				<ion-img :src="require('../img/alimas-logo-min.png')"></ion-img>

			</div>

			<div class="section-signup-body">
				
				<h1 class="text-center">Registrate y comienza a ganar puntos</h1>

				<div class="grid" style="grid-gap: 12px;">
					<input type="text" placeholder="Nombre del negocio/ Persona" v-model="usuario.nombre_negocio">
					<input type="text" placeholder="Nombre de contacto" @keydown="SoloLetras($event)" v-model="usuario.nombre_contacto">
					<input type="text" placeholder="Correo electrónico" v-model="usuario.correo">
					<input type="number" placeholder="RUC del negocio/ DNI" class="input-number" maxlength="11"  v-model="usuario.dni">
					<input type="number" placeholder="Teléfono de contacto" class="input-number"  v-model="usuario.telefono">
					<input type="password" placeholder="Contraseña" v-model="usuario.clave">
					<input type="password" placeholder="Repetir contraseña" v-model="clave_rep">	
				</div>

				<div class="grid justify-items-center">
					
					<button class="btn btn-secondary" @click="CrearCuenta()">CREAR CUENTA</button>

					<div >
						<p style="display: inline-block;">¿Ya tienes una cuenta?</p>
						<button class="btn-clave-rec" @click="this.$router.push('/Login')">Inicia sesión</button>
					</div>

				</div>

			</div>
			
		</div>
	</transition>
	</base-layout>

</template>

<script>
	import axios from 'axios';
	import { IonImg} from '@ionic/vue';
    import grl from '@/script/general';

	import $ from 'jquery';

	export default {

		components: {
			IonImg,
		},

		created(){
		},
		data(){
			return{
				
				usuario:{
					nombre_negocio:null,
					nombre_contacto:null,
					correo:null,
					dni:null,
					telefono:null,
					clave:null				
				},
				//VAR DE CONTROL
				clave_rep:null,
				router:null,
				fase:0,
			}
		},
		methods:{

			//FUNCIONES
			CrearCuenta:async function(){
				if(await this.Vacio(this.usuario)){
					return 0;
				}
				
				if(await !this.VerificarUsuario(this.usuario)){
					return 0;
				}

				if(this.usuario.clave != this.clave_rep){
					return 0;
				}

				this.$swal.fire({
					title:'Creando Cuenta...',
					allowOutsideClick: false,
					width: 400,
					showConfirmButton:false,
				});
				this.$swal.showLoading();

				this.router = this.$router;
				await axios.post(process.env.VUE_APP_API+'RegistrarUsuario',this.usuario).then(async response=>{
					this.$swal.close();
					console.log(response.data);
					if(response.data == 0){
						this.$swal.fire({
							icon:'error',
							title:'El DNI/RUC no existe',
							width:400
						});

					}else if(response.data == 2){
						this.$swal.fire({
							icon:'error',
							title:'El DNI/RUC ya está siendo utilizado',
							width:400
						});
					}
					else{
						this.Login()
					}

				});

			},

			async Login(){

				this.$swal.fire({
					title:'Verificando...',
					allowOutsideClick: false,
					width: 400,
					showConfirmButton:false,
				});
				this.$swal.showLoading();

				await axios.post(process.env.VUE_APP_API+'Login',this.usuario).then(response=>{
					this.$swal.close();
					this.usuario = this.Limpiar(this.usuario);
					localStorage.setItem('usuario', JSON.stringify(response.data[0]));
					this.router.replace('/user');
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
			},

			VerificarUsuario(){
				return true;
			},

			SoloNumeros($event){
				let input = $event.target;
				$(input)
				console.log( )

                // grl.SoloNumero($event);
            },

			SoloLetras($event){
                grl.SoloLetra($event);
            },

			cambiarFase:function(){
				this.fase = this.fase + 1;
			}

		},
		mounted () {
			$(document).on('input', '.input-number', function () { 
				this.value = this.value.replace(/[^0-9]/g,'');
			});
		},

	}	

</script>

<style>
.fade-enter-from{
	opacity:0;
	transform:translateX(+100%);
}
.fade-enter-to{
	opacity:1;
	transform:translateX(0px);
}
.fade-enter-active{
	transition: all .5s ease;
}
.fade-leave-from{
	opacity:1;
	transform:translateX(0px);
}
.fade-leave-to{
	opacity:0;
	transform:translateX(-100%);
}
.fade-leave-active{
	transition: all .2s ease;
}

</style>