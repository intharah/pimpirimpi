<template>
  <div id="main">
    <button @click="openReader">Scan a code</button>
    <modal name="modalScan">
      <v-quagga v-if="isOpen" :onDetected="logIt" :readerSize="{width:320,height:240}" :readerTypes="['ean_reader']"></v-quagga>
    </modal>
    <div  v-if="isShown">
        <div><img id="prod-img" src=""/></div>
        <div id="ean-code"><pre>EAN Code : </pre><b>{{ bcEANCode }}</b></div>
        <div id="eco-grade"><pre>Eco Grade</pre><b>{{ bcEcoGrade }}</b></div>
        <div id="pef-level"><pre>CO² emissions | packaging : </pre><b>{{ bcPefLevel }} kg</b></div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueQuagga from 'vue-quaggajs'
import axios from 'axios'
import vmodal from 'vue-js-modal'

// register components
Vue.use(VueQuagga)
Vue.use(vmodal)

export default {
  name: 'VueBarcodeTest',
  data () {
    return {
      isOpen: false,
      isShown: false,

      // Product data
      bcImgSrc: '',
      bcEANCode: '',
      bcEcoPack: '',
      bcEcoGrade: '',
      bcPefLevel: ''
    }
  },
  methods: {
    openReader: function() {
        this.isShown = false;
        this.isOpen = true;

        // Reset data fields
        this.bcImgSrc = '';
        this.bcEANCode = '';
        this.bcEcoPack = '';
        this.bcEcoGrade = '';
        this.bcPefLevel = '';

        this.$modal.show('modalScan');
    },
    logIt (data) {
        console.log('EAN Code : ', data.codeResult.code);

        axios
        .get('https://world.openfoodfacts.org/api/v0/product/' + data.codeResult.code + '.json')
        .then(response => {
            //display data fields
            this.isOver = true
            this.isShown = true

            //Get data
            this.bcImgSrc = response.data.product.image_front_url
            this.bcEANCode = response.data.code
            this.bcEcoGrade = response.data.product.ecoscore_grade

            this.bcEcoPack = response.data.product.ecoscore_data.agribalyse.co2_packaging
            this.bcPefLevel = this.bcEcoPack * 100
        })
        .catch(error => console.log(error))

        document.getElementById("prod-img").src = this.bcImgSrc;

        this.isOpen = false;
    }
  }
}
</script>

<style>
    #interactive video, canvas {
        width: 100%;
        height: auto;
    }

    #eco-grade{
        text-transform: uppercase;
    }
</style>