<template>
  <div id="main">
    <b-card
      title="Scan a barcode"
      img-src=""
      img-alt="Image"
      img-top
      tag="article"
      style="max-width: 20rem;"
      class="mb-2"
  >
      <b-card-text>And see how the product is polluting</b-card-text>
      <button @click="openReader">Pimpirimpi !</button>
    </b-card>
    <modal name="modalScan">
      <v-quagga v-if="isOpen" :onDetected="logIt" :readerSize="{width:320,height:240}" :readerTypes="['ean_reader']"></v-quagga>
    </modal>
    <modal name="modalRes">
      <div v-if="isShown">
          <div><img id="prod-img" src=""/></div>
          <div id="ean-code"><pre>EAN Code : </pre><b>{{ bcEANCode }}</b></div>
          <div id="eco-grade"><pre>Eco Grade</pre><b>{{ bcEcoGrade }}</b></div>
          <div id="pef-level"><pre>CO² emissions | packaging : </pre><b>{{ bcPefLevel }} kg</b></div>
      </div>
    </modal>
  </div>
</template>

<script>
import Vue from 'vue'
import VueQuagga from 'vue-quaggajs'
import axios from 'axios'
import vmodal from 'vue-js-modal'
import VueBarcodeScanner from 'vue-barcode-scanner'

// register components
Vue.use(VueQuagga)
Vue.use(vmodal)

// inject barcode scanner with option (add sound effect)
// sound will trigger when it's already scanned
let options = {
  sound: true, // default is false
  soundSrc: '/static/sound.wav', // default is blank
  sensitivity: 300, // default is 100
  requiredAttr: true, // default is false
  controlSequenceKeys: ['NumLock', 'Clear'], // default is null
  callbackAfterTimeout: true // default is false
}

Vue.use(VueBarcodeScanner, options)

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
  created () {
    // Add barcode scan listener and pass the callback function
    this.$barcodeScanner.init(this.onBarcodeScanned)
  },
  destroyed () {
    // Remove listener when component is destroyed
    this.$barcodeScanner.destroy()
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
            //close modal
            this.$modal.hide('modalScan');

            //display data fields
            this.isOpen = false
            this.isShown = true

            //Get data
            this.bcImgSrc = response.data.product.image_front_url
            this.bcEANCode = response.data.code
            this.bcEcoGrade = response.data.product.ecoscore_grade

            this.bcEcoPack = response.data.product.ecoscore_data.agribalyse.co2_packaging
            this.bcPefLevel = this.bcEcoPack * 100

            this.$modal.show('modalRes');
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

    #main{
      background-image: url('/background.png');
      background-repeat: no-repeat;
      background-size: cover;
      text-align: center;
      height: 100%;
      display: flex;
      align-items: center;
    }

    html, body{
      height: 100%;
    }

    article{
      /*overflow: hidden;*/
      margin: 0 auto;
      height: 30rem;
    }

    button{
      background: yellow;
      color: orangered;
    }

    .card-body{
      background-color: lightgoldenrodyellow;
      box-shadow: black 5px 5px 1px 1px;
      padding: 1rem;
    }
</style>