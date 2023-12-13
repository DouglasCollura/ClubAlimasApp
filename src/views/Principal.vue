
<template>
  <base-layout>
    <!-- BASE -->
    <div class="temp-user-main container" v-if="fase_cupones == 0">
      <div class="section-user-top">
        <div class="section-user-top-header">
          <div style="position: relative">
            <button
              @click="AbrirNotificaciones"
              class="section-user-top-header-bell"
            >
              <i class="icon-bell"></i>
            </button>
            <div v-if="usuario.new_notificacion" class="bubble-bell"></div>
          </div>

          <div
            class="card-img"
            style="width: 40px; height: 40px"
            @click="this.$router.push('/ProfileUser')"
          >
            <img
              v-if="usuario.url_img_perfil == null"
              src="../img/user-logo.png"
              alt=""
            />
            <img v-else :src="host + usuario.url_img_perfil" alt="" />
          </div>
        </div>

        <div>
          <div class="grid gc-2x-g" style="grid-gap: 10px">
            <div class="align-self-center">
              <h1
                class="text-white text-right"
                style="font-size: 65px; line-height: 65px"
              >
                {{ numeroFormateado(usuario.puntos)}}
              </h1>
            </div>

            <div class="align-self-center">
              <h1 class="text-white font-300">puntos</h1>
            </div>
          </div>

          <p class="font-300">Los puntos se actualizan cada 24 hs</p>
        </div>

        <h2 class="font-500">OBTENER MÁS PUNTOS</h2>
      </div>

      <div class="section-user-body">
        <div class="slider-user">
          <button class="slider-arrow-left" @click="SlideLeft">&lt;</button>

          <transition :name="transition" mode="out-in">
            <div class="slider-img" v-if="slide == 1">
              <img src="../img/slider/slider_1.png" alt="" />
            </div>
            <div class="slider-img" v-else-if="slide == 2">
              <img src="../img/slider/slider_2.png" alt="" />
            </div>
            <div class="slider-img" v-else-if="slide == 3">
              <img src="../img/slider/slider_3.png" alt="" />
            </div>
            <div class="slider-img" v-else-if="slide == 4">
              <img src="../img/slider/slider_4.png" alt="" />
            </div>
            <div class="slider-img" v-else-if="slide == 5">
              <img src="../img/slider/slider_5.png" alt="" />
            </div>
            <div class="slider-img" v-else-if="slide == 6">
              <img src="../img/slider/slider_6.png" alt="" />
            </div>
          </transition>

          <button class="slider-arrow-right" @click="SlideRight">></button>
        </div>

        <div class="card card-user-info">
          <div>
            <div class="grid justify-items-center">
              <div class="chart" :data-percent="porcentaje">
                <span class="percent">{{ porcentaje }}%</span>
              </div>
            </div>
          </div>

          <div class="grid align-content-start" style="grid-gap: 10px">
            <h2 class="text-green">Mi progreso</h2>

            <p>
              ¡Te faltan {{ puntos_faltantes }} puntos para acceder a mayores
              beneficios!
            </p>
          </div>
        </div>

        <div class="card card-user-info">
          <div>
            <div class="grid justify-items-center">
              <div class="chart" data-percent="100">
                <span class="percent"> {{ numeroFormateado(usuario.pts_canjeados) }} </span>
              </div>
            </div>
          </div>

          <div class="grid align-content-start" style="grid-gap: 10px">
            <h2 class="text-green">Puntos canjeados</h2>

            <p>
              Has canjeado hasta el momento {{ numeroFormateado(usuario.pts_canjeados) }} puntos.
            </p>
          </div>
        </div>

        <div class="user-group-button">
          <button
            class="user-group-button-select"
            @click="cambiarFaseBeneficio(0, $event)"
          >
            Beneficios disponibles
          </button>
          <button @click="cambiarFaseBeneficio(1, $event)">
            Lo que podrías obtener
          </button>
        </div>

        <div v-show="fase_beneficio == 0" class="grid" style="grid-gap: 10px">
          <h1>Canjea tus puntos</h1>

          <div v-if="cupones == null" class="load"></div>

          <div
            class="card card-beneficio-disponible"
            @click="VerCupon(cupon)"
            v-for="cupon in cupones"
            :key="cupon.id"
          >
            <div class="grid align-items-center card-img" style="">
              <div class="card-img align-self-center">
                <img :src="host + cupon.url_img" alt="" />
              </div>
            </div>

            <div class="grid" style="grid-gap: 5px">
              <h3 class="font-400">{{ cupon.titulo }}</h3>

              <h3 class="font-400">{{ cupon.nombre_negocio }}</h3>
              <p>{{ cupon.tipo_negocio }}</p>

              <h2
                v-if="cupon.descuento != null"
                class="text-green align-self-end font-400"
              >
                Descuento: {{ cupon.descuento }}%
              </h2>
              <h2 v-else class="text-green align-self-end font-400">
                Precio: S/. {{ numeroFormateado(cupon.precio, 2) }}
              </h2>
            </div>

            <div class="text-center">
              <h3>{{ numeroFormateado(cupon.puntos) }}</h3>
              <p>puntos</p>
            </div>
          </div>
        </div>

        <div v-show="fase_beneficio == 1" class="grid" style="grid-gap: 10px">
          <h1>Próximos beneficios</h1>
          <div class="content-cupon-prox">
            <div v-if="proximos == null" class="load"></div>

            <div class="card card-prox" v-for="cupon in proximos" :key="cupon">
              <div class="card-prox-img-content">
                <div class="card-prox-correct">
                  <i class="icon-correct"></i>
                </div>
                <div
                  class="card-img"
                  style="width: 100px; height: 100px; border-radius: 70px"
                >
                  <img :src="host + cupon.url_img" alt="" />
                </div>
              </div>

              <h1
                v-if="cupon.descuento != null"
                class="text-green align-self-end font-400"
              >
                Descuento: {{ cupon.descuento }}%
              </h1>
              <h1 v-else class="text-green align-self-end font-400">
                Precio: S/. {{ numeroFormateado(cupon.precio, 2) }}
              </h1>

              <div class="card-prox-target">
                <div>Próximo</div>
              </div>

              <div class="card-prox-body">
                <div class="card-prox-body-point"></div>
                <div class="align-self-center">
                  <p>{{ cupon.titulo }}</p>
                </div>
                <div class="card-prox-body-point"></div>

                <div class="align-self-center">
                  <p>{{ cupon.nombre_negocio }}</p>
                </div>

                <div class="card-prox-body-point"></div>
                <div class="align-self-center">
                  <p>{{ cupon.tipo_negocio }}</p>
                </div>

                <div class="card-prox-body-point"></div>
                <div class="align-self-center">
                  <p>Puntos: {{ numeroFormateado(cupon.puntos) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- FIN BASE -->
  </base-layout>

  <Canje
    v-if="fase_cupones == 1"
    :cupon="cupon"
    :puntos="usuario.puntos"
    :documento="usuario.dni"
    :id_usuario="usuario.id"
    @Return="Return"
    @UpdatePuntos="UpdatePuntos"
  />
</template>

<script>
import axios from "axios";
import $ from "jquery";
import EasyPieChart from "easy-pie-chart";
import Canje from "@/componentes/canje.vue";
import {decimalNumberMixin} from '../mixins/decimalNumberMixin'

export default {
  components: {
    Canje,
  },

  async created() {
    await this.CargarUsuario();
  },
  data() {
    return {
      //CARGA
      usuario: null,
      cupones: null,
      proximos: null,
      //VAR GESTION
      cupon: null,
      //VAR CONTROL
      puntos_faltantes: null,
      porcentaje: 20,
      fase_beneficio: 0,
      fase_cupones: 0,
      router: null,
      slide: 1,
      transition: "fade-right",
      host: process.env.VUE_APP_HOST,
      api: process.env.VUE_APP_API,
    };
  },
	mixins:[decimalNumberMixin],
  // computed: {
  //   numeroFormateado: () => (valor, cantidadDecimales = 0) => {
  //     // Verifica si el valor es un número antes de continuar
  //     if (typeof valor !== 'number' || isNaN(valor)) {
  //       return 'Valor no válido';
  //     }

  //     // Redondea el valor a la cantidad de decimales especificada
  //     const redondeado = Math.round(valor * Math.pow(10, cantidadDecimales)) / Math.pow(10, cantidadDecimales);

  //     // Convierte el número a cadena y divide en parte entera y decimal
  //     const [parteEntera, parteDecimal] = redondeado.toString().split('.');

  //     // Formatea la parte entera con comas
  //     const parteEnteraFormateada = parteEntera.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  //     // Devuelve el número formateado
  //     return parteEnteraFormateada + (parteDecimal ? '.' + parteDecimal : '');
  //   },
  // },

  methods: {
    //===================CARGA=====================================================
    async CargarUsuario() {
      if (this.usuario == null) {
        this.usuario = JSON.parse(localStorage.getItem("usuario"));
        if (!this.usuario.rango) {
          this.usuario.rango = "5000+";
          this.puntos_faltantes = 0;
          this.porcentaje = 100;
        } else {
          this.puntos_faltantes = this.usuario.rango - this.usuario.puntos;
          this.porcentaje = (
            100 -
            (this.puntos_faltantes * 100) / this.usuario.rango
          ).toFixed(0);
        }
      }

      await this.CargarCupones();
    },

    async CargarCupones() {
      const params = {
        puntos: this.usuario.puntos,
        rango: this.usuario.rango,
      };
      this.cupones = null;
      await axios
        .post(process.env.VUE_APP_API + "GetBeneficioPorPunto", params)
        .then((response) => {
          this.cupones = response.data;
        });
    },

    async CargarProximos() {
      const params = {
        puntos: this.usuario.puntos,
        rango: this.usuario.rango,
      };
      this.proximos = null;
      await axios
        .post(process.env.VUE_APP_API + "GetBeneficioProximos", params)
        .then((response) => {
          this.proximos = response.data;
        });
    },

    //===================FUNCIONES=====================================================
    async UpdateToken() {
      const params = {
        dni: this.usuario.dni,
        token: sessionStorage.getItem("token"),
      };
      await axios.post(process.env.VUE_APP_API + "UpdateToken", params);
    },

    AbrirNotificaciones() {
      this.usuario.new_notificacion = null;
      this.$router.push("/Notificaciones");
    },

    VerCupon(cupon) {
      this.fase_cupones = 1;
      this.$emit("footer", 0);
      this.cupon = cupon;
    },

    async Refresh() {
      const params = {
        dni: this.usuario.dni,
      };

      this.$swal.fire({
        title: "Cargando...",
        allowOutsideClick: false,
        width: 400,
        showConfirmButton: false,
      });

      await axios
        .post(process.env.VUE_APP_API + "RefreshUser", params)
        .then((response) => {
          this.$swal.close();
          localStorage.clear();
          localStorage.setItem("usuario", JSON.stringify(response.data[0]));
          this.usuario = response.data[0];
          if (!this.usuario.rango) {
            this.usuario.rango = "5000+";
            this.puntos_faltantes = 0;
            this.porcentaje = 100;
          } else {
            this.puntos_faltantes = this.usuario.rango - this.usuario.puntos;
            this.porcentaje = (
              100 -
              (this.puntos_faltantes * 100) / this.usuario.rango
            ).toFixed(0);
          }
        });

      $(document).ready(function () {
        var chars = document.querySelectorAll(".chart");

        chars.forEach((element) => {
          EasyPieChart(element, {
            easing: "easeOutElastic",
            delay: 500,
            barColor: "#2D6636",
            trackColor: "#E2E4E7",
            scaleColor: false,
            lineWidth: 8,
            trackWidth: 8,
            lineCap: "butt",
          });
        });
      });
    },

    //===============FUNCIONES DE CONTROL==============================================

    Return() {
      this.fase_cupones = 0;
      this.$emit("footer", 1);
    },

    async UpdatePuntos(puntos, pts_canjeados) {
      this.usuario.puntos = puntos;
      this.usuario.pts_canjeados =
        parseInt(this.usuario.pts_canjeados, 10) + parseInt(pts_canjeados, 10);
      await this.Refresh();
      await this.CargarCupones();
    },

    cambiarFaseBeneficio: function (fase, $event) {
      this.fase_beneficio = fase;
      $(".user-group-button-select").removeClass("user-group-button-select");
      $($event.target).addClass("user-group-button-select");
      if (fase == 1) {
        this.CargarProximos();
      } else {
        this.CargarCupones();
      }
    },

    SlideRight() {
      if (this.slide < 6) {
        this.slide += 1;
        this.transition = "fade-right";
      } else {
        this.slide = 1;
        this.transition = "fade-right";
      }
    },
    SlideLeft() {
      if (this.slide > 1) {
        this.slide -= 1;
        this.transition = "fade-left";
      } else {
        this.slide = 6;
        this.transition = "fade-left";
      }
    },
  },
  mounted() {
    // window.onpopstate = function(event) {
    // alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
    // };
    setInterval(() => {
      this.SlideRight();
    }, 3000);
    this.Refresh();
    this.UpdateToken();
    $(document).ready(function () {
      var chars = document.querySelectorAll(".chart");

      chars.forEach((element) => {
        EasyPieChart(element, {
          easing: "easeOutElastic",
          delay: 500,
          barColor: "#2D6636",
          trackColor: "#E2E4E7",
          scaleColor: false,
          lineWidth: 8,
          trackWidth: 8,
          lineCap: "butt",
        });
      });
    });
  },
  watch: {
    fase_cupones: function () {
      if (this.fase_cupones == 0) {
        $(document).ready(function () {
          var chars = document.querySelectorAll(".chart");

          chars.forEach((element) => {
            EasyPieChart(element, {
              easing: "easeOutElastic",
              delay: 500,
              barColor: "#2D6636",
              trackColor: "#E2E4E7",
              scaleColor: false,
              lineWidth: 8,
              trackWidth: 8,
              lineCap: "butt",
            });
          });
        });
      }
    },
  },
};
</script>

<style>
.fade-right-enter-from {
  opacity: 0;
  transform: translateX(+100%);
}
.fade-right-enter-to,
.fade-left-enter-to {
  opacity: 1;
  transform: translateX(0px);
}
.fade-left-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.fade-right-enter-active,
.fade-left-enter-active {
  transition: all 0.5s ease;
}
.fade-right-leave-from,
.fade-left-leave-from {
  opacity: 1;
  transform: translateX(0px);
}
.fade-right-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
.fade-left-leave-to {
  opacity: 0;
  transform: translateX(+100%);
}
.fade-right-leave-active,
.fade-left-leave-active {
  transition: all 0.2s ease;
}
</style>