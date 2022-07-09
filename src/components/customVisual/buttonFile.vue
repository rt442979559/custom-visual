<template>
  <div>
    <div v-if="value">
      <el-button size="small" type="primary" @click="download">下载</el-button>
      <el-button size="small" type="danger" @click="$emit('update:value', '')">删除</el-button>
    </div>
    <div v-else>
      <el-button size="small" @click="openUp">选择文件</el-button>
    </div>
    <input
      v-show="false"
      ref="inputEl"
      type="file"
      @change="importData"
    >
  </div>
</template>

<script>
// import { zbkUpFile } from '@/api/indicator/indicatorInterface.js'
import FileSaver from 'file-saver'

export default {
  props: ['value'],
  methods: {
    openUp() {
      this.$refs.inputEl.click()
    },
    download() {
      const url = `${process.env.VUE_APP_FILE_BASE_API}${this.value}`
      const oReq = new XMLHttpRequest()
      oReq.open('GET', url, true)
      oReq.responseType = 'blob'
      oReq.onload = function() {
        const file = new Blob([oReq.response])
        FileSaver.saveAs(file)
      }
      oReq.send()
    },
    async importData(event) {
      if (event.currentTarget.files.length === 0) {
        return
      }
      var file = event.currentTarget.files[0]
      if (file.size / 1024 / 1024 > 10) {
        return this.$message.error('文件大小不得超过10MB')
      }
      event.currentTarget.value = null
      const fd = new FormData()
      fd.append('file', file)
      // const { data } = await zbkUpFile(fd)
      // if (data.success) {
      //   this.$message.success('上传成功')
      //   this.$emit('update:value', process.env.VUE_APP_FILE_BASE_API + data.data)
      // } else {
      //   this.$message.error('上传失败')
      // }
    }
  }
}
</script>
