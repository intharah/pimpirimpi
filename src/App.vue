<template>
  <div>
    <button @click="openReader">Start scanning</button>
    <v-quagga v-if="isOpen" :onDetected="logIt" :readerSize="{width:320,height:240}" :readerTypes="['ean_reader']"></v-quagga>
    <div  v-if="isShown">
        <div id="ean-code"><pre>EAN Code : </pre><b>{{ bcEANCode }}</b></div>
        <div id="eco-grade"><pre>Eco Grade</pre><b>{{ bcEcoGrade }}</b></div>
        <div id="agri-code"><pre>Agribalyse Code : </pre><b>{{ bcAgri }}</b></div>
        <div id="pef-level"><pre>PEF Level for packaging : </pre><b>{{ bcPefLevel }} %</b></div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueQuagga from 'vue-quaggajs'
import axios from 'axios'

// register component 'v-quagga'
Vue.use(VueQuagga)

export default {
  name: 'VueBarcodeTest',
  data () {
    return {
      isOpen: false,
      isShown: false,

      // Product data
      bcEANCode: '',
      bcAgri: '',
      bcEcoPack: '',
      bcEcoGrade: '',
      bcPefLevel: ''
    }
  },
  methods: {
    openReader: function() {
        this.isShown = false;
        this.isOpen = true;
    },
    logIt (data) {
        console.log('EAN Code : ', data.codeResult.code);

        axios
        .get('https://world.openfoodfacts.org/api/v0/product/' + data.codeResult.code + '.json')
        .then(response => {
            //display data fields
            this.isOver = true
            this.isShown = true

            //send data
            this.bcEANCode = response.data.code
            this.bcEcoGrade = response.data.product.ecoscore_grade
            this.bcAgri = response.data.product.ecoscore_data.agribalyse.agribalyse_food_code

            this.bcEcoPack = response.data.product.ecoscore_data.agribalyse.co2_packaging
            this.bcPefLevel = this.bcEcoPack * 100
        })
        .catch(error => console.log(error))

        this.isOpen = false;
    }

  }
}
</script>

<style>
    #interactive video, canvas {
        width: 320px;
        height: 240px;
    }

    #eco-grade{
        text-transform: uppercase;
    }
</style>