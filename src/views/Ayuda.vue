<template>

	<base-layout>
		<div v-if="mensaje.id_chat == null" class="new-chat">
			<img src="../img/mail.png" alt="">
			<h1 v-if="new_chat == 0" class="text-center">¿Tienes una consulta? Escribe y envía tu mensaje</h1>
			<h1 v-if="new_chat == null" class="text-center">Cargando...</h1>
		</div>

		<div class="container temp-ayuda">
			

			<div class="section-ayuda-top">
				
			</div>
			<div class="section-ayuda-body">
				
				<div :class="mensaje.remitente == 1 ? 'chat-container-em' : 'chat-container-co'" v-for="mensaje in mensajes" :key="mensaje.id">
					<div :class="mensaje.remitente == 1 ? 'card-chat-em' : 'card-chat-co'">
						<p v-if="mensaje.tipo == 0" @click="GoToBrowser(mensaje.mensaje)" > {{mensaje.mensaje}} </p>
                		<img v-else style="width:100%" @click="AbrirImg(mensaje.mensaje, 0)" :src="host+mensaje.mensaje" alt="">
					</div>
					<h3 :class="mensaje.remitente == 1 ? 'justify-self-start font-300' :'justify-self-end font-300'" v-text="Tiempo(mensaje.fecha, mensaje.hora)" ></h3>
				</div>

				<div class="chat-container-em"  v-for="mensaje in mensajes_int" :key="mensaje.id">

					<div class="card-chat-em">
						<p v-if="mensaje.tipo == 0" @click="GoToBrowser(mensaje.mensaje)"> {{mensaje.mensaje}} </p>
                		<img v-else style="width:100%" @click="AbrirImg(mensaje.mensaje, 1)" :src="mensaje.mensaje" alt="">
					</div>
					<h3 v-if="mensaje.enviado == 0" class="justify-self-start font-300">Enviando....(No salga del chat)</h3>
					<h3 v-else class="justify-self-start font-300"> {{mensaje.hora}} </h3>
				</div>

			</div>

			<div class="section-ayuda-bottom">
				<input type="text" @keyup="VerificarInput($event)" placeholder="Escribir mensaje" v-model="content_mensaje">
			
				<div class="btn-enviar"  v-if="camera_send" @click="fase_foto = true" >
            		<img src="../img/camera-send.png"  alt="">
				</div>
			
				<div class="btn-enviar" v-else @click="EnviarMensaje">
					<img  src="../img/icons/send.svg" alt="">
				</div>

			</div>
			
		</div>

	</base-layout>

	<div class="modal-img-chat" >
		<div class="content-group-button-modal-chat">
			<button class="modal-img-button" @click="ImgMore">+</button>
			<button class="modal-img-button" @click="ImgLess">-</button>
			<button class="modal-img-button" @click="CerrarModal">x</button>
		</div>

		<div class="modal-img-content">
			<img id="img-modal" :src="modal_img" alt="">
		</div>
	</div>

	<div class="grid modal-info" v-if="fase_foto">
		<img  src="../img/camera.png" alt="">

		<button class="btn btn-primary" @click="EnviarFoto(1)">TOMAR FOTO</button>
		<button class="btn btn-secondary" @click="EnviarFoto(2)">SUBIR CON GALERÍA</button>
		<button class="btn btn-secondary" @click="fase_foto =false">CANCELAR</button>
	</div>


</template>

<script>
	import axios from 'axios';
	import $ from 'jquery';
	import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
	import { Browser } from '@capacitor/browser';

	//import EasyPieChart from "easy-pie-chart";

	export default{

		components: {
		},

		created(){
			this.usuario = JSON.parse(localStorage.getItem('usuario'));
			this.CrearFecha();
			this.CargarChat();
			
		},
		data(){
			return{
				//CARGA
				mensajes:[],

				//GESTION
				usuario:null,
				mensaje:{
					mensaje:null,
					remitente:1,
					id_chat:null,
					hora:null
				},

				//VAR CONTROL
				modal_img:null,
				mensajes_int:[],
				timer:0,
				content_mensaje:'',
				new_chat:null,
        		fecha_hoy:null,
				camera_send:true,
				host:process.env.VUE_APP_HOST,
				api: process.env.VUE_APP_API,
				fase_foto:false

			}
		},
		methods:{

			//CARGA
			async CargarChat(){
				const params={
					id_usuario:this.usuario.id,
				}

				await axios.post(process.env.VUE_APP_API+'CargarChat',params).then(response=>{
					if(response.data != 'nulo'){
						this.mensaje.id_chat = response.data[0].id;
						this.CargarMensaje();
					}else{
						this.new_chat = 0;
					}
					$(".new-chat").css("z-index","2");
				});

			},

			async CargarMensaje(){

				const params={
					id_chat:this.mensaje.id_chat
				}

				await axios.post(process.env.VUE_APP_API+'CargarMensaje',params).then(response=>{
					this.mensajes = response.data;
					this.scroll(2);
				})
			},

			//FUNCIONES

			async CrearChat(){

				const params={
					id_usuario:this.usuario.id,
					mensaje:this.content_mensaje.substr(0,45)+'...'
				}

				await axios.post(process.env.VUE_APP_API+'CrearChat',params).then(response=>{
					this.mensaje.id_chat = response.data[0].id;

					this.EnviarMensaje();
				});

			},

			async EnviarMensaje(){
				if(this.content_mensaje == '' ){
					return 0;
				}
				if(this.mensaje.id_chat == null){
					
					await this.CrearChat();

				}else{
					this.mensaje.mensaje = this.content_mensaje;
					var hoy = new Date();	
					var hora = hoy.getHours() + ':' + hoy.getMinutes();
					this.mensaje.hora = hora;
					this.mensajes_int.push({mensaje:this.mensaje.mensaje, hora: hora , id:this.mensajes_int, tipo:0, id:this.mensajes_int.length, enviado:0});
					this.scroll(3);
					this.content_mensaje = '';
					this.camera_send = true;
					await axios.post(process.env.VUE_APP_API+'Mensaje',this.mensaje).then(()=>{
						console.log("Enviado");
						for (const valor of this.mensajes_int) {
							if(valor.id == this.mensajes_int.length-1){
								valor.enviado = 1
							}
						}
						// this.mensajes_int.find(t=> t.id == (this.mensajes_int.length-1));
					});

				}
			},

			async EnviarFoto(tipo){
				if(this.mensaje.id_chat == null){
					
					await this.CrearChat();

				}else{
					let image=null;
					var hoy = new Date();	
					var hora = hoy.getHours() + ':' + hoy.getMinutes();
					this.mensaje.hora = hora;
					if(tipo == 1){
						image = await Camera.getPhoto({
							quality: 40,
							source: CameraSource.Camera,
							resultType: CameraResultType.Uri
						});
						
					}else{
						image = await Camera.getPhoto({
							quality: 40,
							source: CameraSource.Photos,
							resultType: CameraResultType.Uri
						});
					}

					this.mensajes_int.push({mensaje: image.webPath,  hora: hora , id:this.mensajes_int, tipo:1, id:this.mensajes_int.length, enviado:0});

					let blob = await fetch(image.webPath).then(r => r.blob());
					let formData = new FormData();
					formData.append('imagen',blob);
					formData.append('tipo','1');
					formData.append('remitente','1');
					formData.append('hora',hora);
					formData.append('id_chat',this.mensaje.id_chat);
					this.fase_foto =false;
					this.scroll(2);
					await axios.post(process.env.VUE_APP_API+'Mensaje',formData).then(()=>{
						console.log("Enviado");
						
						for (const valor of this.mensajes_int) {
							if(valor.id == this.mensajes_int.length-1){
								valor.enviado = 1
							}
						}
					});
				}	
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
			},

			//CONTROL

			Tiempo(e, hora){
				if(e == this.fecha_hoy){
					return hora;
				}else if(e < this.fecha_hoy){
					return e.split("-").reverse().join("-");
				}else{
					return e.split("-").reverse().join("-");
				}
			},

			CrearFecha(){
				let fecha = new Date();
				
				this.fecha_hoy += fecha.getFullYear();
				if((fecha.getMonth()+1 )<10){
					this.fecha_hoy +="-"+'0'+(fecha.getMonth()+1 )
				}else{
					this.fecha_hoy +="-"+(fecha.getMonth()+1 )
				}

				if(fecha.getDate()<10){
					this.fecha_hoy +="-"+'0'+fecha.getDate()
				}else{
					this.fecha_hoy +="-"+fecha.getDate()
				}
				console.log(this.fecha_hoy)
			},

			scroll(time){

				if(this.timer < time){
					setTimeout(() => {
						console.log($( "div.section-ayuda-body div" ).last());
						//const el = this.$el.querySelector(".section-ayuda-body");
						//el.scrollIntoView({block: "end", behavior: "smooth"});
						const el = $( "div.section-ayuda-body div" ).last();
						el[0].scrollIntoView(); 
						console.log("scroll");
						this.timer ++;
						this.scroll();
					}, 200);
				}else{
					this.timer = 0;
				}

			},

			AbrirImg(img, tipo){
				$('.modal-img-chat').css('display','grid');
				if(tipo == 0){
					this.modal_img = process.env.VUE_APP_HOST+img;
				}else{
					this.modal_img = img;
				}
			},

			ImgMore(){
				$('#img-modal').css("width",($('#img-modal')[0].clientWidth+100)+"px");
				$('#img-modal').css("height",($('#img-modal')[0].clientHeight+100)+"px");
			},
			ImgLess(){
				$('#img-modal').css("width",($('#img-modal')[0].clientWidth-100)+"px");
				$('#img-modal').css("height",($('#img-modal')[0].clientHeight-100)+"px");
			} ,

			CerrarModal(){
				$('.modal-img-chat').css('display','none');
			},

			VerificarInput($event){
				if($event.target.value){
					this.camera_send = false;
				}else{
					this.camera_send = true;
				}
			}

		},
		mounted(){
		},
		
	}	

</script>

