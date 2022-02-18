<template>

	<base-layout>

		<div class="temp-user-perfil container">
			
			<div class="section-user-perfil-top">
				
				<div class="section-user-perfil-header gc-2x-g">
					<button @click="$router.go(-1)" class="back-button icon-arrow-back justify-self-start"></button>

					<button class="btn-close" @click="CerrarSesion()">CERRAR SESIÓN</button>
				</div>

				<div class="user-perfil-img-back">
					<img v-if="usuario.url_img_portada == null" src="../../img/back-img-user.png"  alt="">
					<img v-else :src="host+usuario.url_img_portada"  alt="">
					<div @click="CambiarFoto(2)" class="edit-user-back-img icon-edit"></div>
				</div>

				<div class="user-perfil-middle">

					<div>
						<div class="user-perfil-img">
							<div class="card-img" style="width:100px;height:100px; border-radius:80px">
								<img v-if="usuario.url_img_perfil == null" src="../../img/user-logo.png" alt="">
								<img  v-else :src="host+usuario.url_img_perfil" alt="">

								<div @click="CambiarFoto(1)" class="edit-user-img icon-edit"></div>			
							</div>
						</div>						
					</div>


					<div>
						<h1 class="text-green font-300"> {{usuario.nombre_negocio}} </h1>
					</div>	
				</div>


			</div>

			<div class="section-user-perfil-body">
				<h2>Datos del negocio</h2>

				<div class="section-user-perfil-body-content">

					<div class="icon-user justify-self-end" style="font-size: 24px;"></div>
					<div>
						<h3>{{usuario.nombre_contacto}}</h3>
					</div>

					<div class="icon-locacion align-self-center justify-self-end" style="font-size: 24px;"></div>
					<div>
						<h3>{{usuario.direccion}}</h3>
					</div>

					<div class="icon-telefono justify-self-end" style="font-size: 24px;"></div>
					<div>
						<h3>{{usuario.telefono}}</h3>
					</div>

					<div class="icon-mail justify-self-end" style="font-size: 24px;"></div>
					<div>
						<h3>{{usuario.correo}}</h3>
					</div>

					<div class="icon-dni justify-self-end" style="font-size: 24px;"></div>
					<div>
						<h3>{{usuario.dni}}</h3>
					</div>
				</div>
					
			</div>

		</div>

		<div class="grid modal-info" v-if="fase_foto == 1">
        	<img  src="../../img/camera.png" alt="">

			<button class="btn btn-primary" @click="TomarFoto">TOMAR FOTO</button>
			<button class="btn btn-secondary" @click="SubirFoto">SUBIR CON GALERÍA</button>
		</div>
		
	</base-layout>

</template>

<script>
	import axios from 'axios';
	import $ from 'jquery';
	import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

	export default{

		created(){
			this.usuario = JSON.parse(localStorage.getItem('usuario'));
		},
		data(){
			return{
				//CARGA
				usuario:{},
				imagen:null,
				//CONTROL
				fase_beneficio:0,
				fase_foto:0,
				tipo_foto:null,
				host:process.env.VUE_APP_HOST,
				api: process.env.VUE_APP_API
			}
		},
		methods:{

		//FUNCION ==================================

			CerrarSesion:function(){
				localStorage.clear();
				window.location.href = window.location.origin + '/';
				//this.$router.push('/');
			},

			async TomarFoto(){
				const image = await Camera.getPhoto({
					quality: 40,
					source: CameraSource.Camera,
					resultType: CameraResultType.Uri
				});

				this.imagen = image.webPath;
				this.fase_foto = 0;
				let blob = await fetch(image.webPath).then(r => r.blob());
				let formData = new FormData();
				formData.append("imagen", blob);

				if(this.tipo_foto == 1){
					formData.append("tipo", 1);
				}else{
					formData.append("tipo", 2);
				}

				formData.append("id", this.usuario.id);
				this.$swal.fire({
					title:'Subiendo Imagen...',
					allowOutsideClick: false,
					width: 400,
					showConfirmButton:false,
				});
				this.$swal.showLoading();
                await axios.post(process.env.VUE_APP_API+'CargarFotoPerfil',formData).then(async response => {
					this.$swal.close();
					console.log(response.data);
					if(this.tipo_foto == 1){
						this.usuario.url_img_perfil = response.data;
					}else{
						this.usuario.url_img_portada = response.data;
					}
					localStorage.clear();
					localStorage.setItem('usuario', JSON.stringify(this.usuario));
				});

			},

			async SubirFoto(){
				 const image = await Camera.getPhoto({
					quality: 40,
					source: CameraSource.Photos,
					resultType: CameraResultType.Uri
				});
				this.fase_foto = 0;
				let blob = await fetch(image.webPath).then(r => r.blob());
				let formData = new FormData();
				formData.append("imagen", blob);

				if(this.tipo_foto == 1){
					formData.append("tipo", 1);
				}else{
					formData.append("tipo", 2);
				}

				formData.append("id", this.usuario.id);
				this.$swal.fire({
					title:'Subiendo Imagen...',
					allowOutsideClick: false,
					width: 400,
					showConfirmButton:false,
				});
				this.$swal.showLoading();
                await axios.post(process.env.VUE_APP_API+'CargarFotoPerfil',formData).then(async response => {
					this.$swal.close();
					console.log(response.data);
					if(this.tipo_foto == 1){
						this.usuario.url_img_perfil = response.data;
					}else{
						this.usuario.url_img_portada = response.data;
					}
					localStorage.clear();
					localStorage.setItem('usuario', JSON.stringify(this.usuario));
				});
			},


		//CONTROL ==================================

			CambiarFoto(tipo){
				this.tipo_foto = tipo;
				this.fase_foto = 1;
			},

			cambiarFaseBeneficio:function(fase,$event){
				this.fase_beneficio = fase;
				console.log($event);
				$('.user-group-button-select').removeClass('user-group-button-select');
				$($event.target).addClass('user-group-button-select');
			}
		}

	}	

</script>

