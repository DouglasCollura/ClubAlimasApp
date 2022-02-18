<ion-slides pager="true" ref="signSlides">
				<ion-slide>
				<h1>Slide 1</h1>
				</ion-slide>
				<ion-slide>
				<h1>Slide 2</h1>
				</ion-slide>
				<ion-slide>
				<h1>Slide 3</h1>
				</ion-slide>
			</ion-slides>
			<button @click="nextSlide">asd</button>

setup() {
			const signSlides = ref(null);
			onMounted(()=>{
				console.log(signSlides.value);
			});
			
			const nextSlide = async ()=>{
				//debugger;
				//const s = await signSlides?.value?.$el.getSwiper();
				//await s.nextSlide();
				const s = await signSlides.value.$el.getSwiper();
				await s.slideNext();

				if(s.activeIndex == (s.slides.length-1)){
					console.log('a');
				}
				console.log(signSlides.value.$el.getSwiper());
			}

			return { signSlides, nextSlide};
		},