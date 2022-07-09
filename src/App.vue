<template>
  <div id="app">
    <div v-if="form.visualizationStructre">
      <CustomVisual
        ref="customVisualRef"
        :visualization-structre="form.visualizationStructre"
        :visualization-json="form.visualizationJson"
        @update:formData="val => form.visualizationStructre = val"
        @update:jsonData="val => form.visualizationJson = val"
      />
    </div>
  </div>
</template>

<script>
import { init } from 'events'
import { formData } from './components/customVisual/formData'
import CustomVisual from './components/customVisual/index.vue'
export default {
  name: 'App',
  components: { CustomVisual },
  data() {
    return {
      form:{
        visualizationStructre:''
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init(){
      this.$nextTick(() => {
        this.form.visualizationStructre = JSON.stringify(formData)
        // *!如果没有form.visualizationStructre时,设置默认值
        if (!this.form.visualizationStructre) {
          this.form.visualizationStructre = JSON.stringify(formData)
        }
      })
    }
  },
}
</script>
