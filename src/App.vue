<template>
  <div>
    <button @click="openReader">Start scanning</button>
    <v-quagga v-if="isOpen" :onDetected="logIt" :readerSize="readerSize" :readerTypes="['ean_reader']"></v-quagga>
  </div>
</template>

<script>
import Vue from 'vue'
import VueQuagga from 'vue-quaggajs';

// register component 'v-quagga'
Vue.use(VueQuagga);

export default {
  name: 'VueBarcodeTest',
  data () {
    return {
      isOpen: false,
      readerSize: {
        width: 640,
        height: 480
      },
      detecteds: []
    }
  },
  methods: {
    openReader: function() {
        this.isOpen = true;
    },
    logIt (data) {
        console.log('EAN Code : ', data.codeResult.code);
        alert('EAN Code : ' + data.codeResult.code);
        this.isOpen = false;
    }

  }
}
</script>