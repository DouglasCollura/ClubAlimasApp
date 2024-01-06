<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent } from 'vue';
import {PushNotifications} from "@capacitor/push-notifications";



export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  },
  data() {
      return {
          token:""
      }
  },
  mounted(){
		// sessionStorage.setItem('token', 'asdasd');

    PushNotifications.addListener("registration",(token)=>{
        this.token = token.value;
        sessionStorage.removeItem('token');
		sessionStorage.setItem('token', this.token);
    });

    PushNotifications.addListener("pushNotificationReceived",(Notification)=>{
    })

    
    PushNotifications.addListener('pushNotificationActionPerformed', notification => {
		this.$router.push('/Notificaciones');
    });

    PushNotifications.register();

  }
});
</script>