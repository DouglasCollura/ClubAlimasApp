	<template>
		
	<ion-page>

		<ion-content>
			
			<mainUser v-if="fase == 0" @footer="cambiarFooter" />

			<CuponesUser v-if="fase == 1"  @footer="cambiarFooter" />

			<Ayuda v-if="fase == 2" />
		</ion-content>
		
		<div class="footer-base-user" v-if="footer== 1">
			<button @click="cambiarFaseFooter(0)" id="0" class="text-green"> <i class="icon-home text-green"></i> Inicio </button>
			<button @click="cambiarFaseFooter(1)" id="1" > <i class="icon-ticket"></i> Mis cupones</button>
			<button @click="cambiarFaseFooter(2)" id="2" > <i class="icon-ayuda"></i> Chat</button>
		</div>

	</ion-page>

</template>

<script>

	import $ from 'jquery';
	import mainUser from '../Principal';
	import CuponesUser from '../Cupones';
	import Ayuda from '../Ayuda';
	import { IonPage, IonContent} from '@ionic/vue';

	export default{

		components: {
			IonPage,
			IonContent,
			mainUser,
			CuponesUser,
			Ayuda
		},
		data(){
			return{
			
				fase:0,
				footer:1,

			}
		},

		methods:{

			cambiarFaseFooter:function(fase){
				this.fase = fase;

				$('.text-green').removeClass('text-green');
				//$($event).addClass('text-green');
				$("#"+fase).addClass('text-green');
				$("#"+fase).find('i').addClass('text-green');
			},
			cambiarFooter:function(e){
				console.log(e);
				this.footer=e;
			}

		}

	}	

</script>
