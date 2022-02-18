function SoloNumero (e){
    if( !( e.keyCode >= 96 && e.keyCode <= 105 ) && (e.keyCode < 48 || e.keyCode > 57) && e.keyCode != 8) {
       return  e.preventDefault();
    }
}

function SoloLetra(e){
    if((e.keyCode < 65 || e.keyCode > 90) && e.keyCode != 8) {
       return  e.preventDefault();
    }
}


export default {
    SoloLetra,
    SoloNumero
}