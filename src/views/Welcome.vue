<template>

	<base-layout>

		<div class="container temp-welcome">
			
			<div class="top-welcome">
				<ion-img :src="require('../img/alimas-logo-min.png')"></ion-img>

				<h1 class="text-center">¡Te damos la bienvenida a Club Alimás!</h1>
			</div>

			<div class="middle-welcome">
				<ion-img :src="require('../img/img-welcome.png')"></ion-img>
			</div>

			<div class="bottom-welcome">
				
				<button class="btn btn-primary" @click="$router.push('/SignUp')">CREAR CUENTA</button>
				<button class="btn btn-secondary" @click="$router.push('/Login')">INICIAR SESIÓN</button>

			</div>

		</div>



	</base-layout>

</template>

<script>
	import { IonImg } from '@ionic/vue';
	//import axios from 'axios';
	//import $ from 'jquery';
	export default{

		components: {
			IonImg
		},
		created(){
			if(localStorage.dni){
				this.$router.push('/Login');
			}
		},
		data(){
			return{
				
				fase_beneficio:0,
				image:null
			}
		},
		methods:{

		}

	}	

</script>

