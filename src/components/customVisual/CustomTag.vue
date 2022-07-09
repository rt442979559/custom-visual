<template>
  <div>
    标签组件：
    <el-tag
      v-for="tag in dynamicTags"
      :key="tag"
      closable
      :disable-transitions="false"
      @click="changeValue(tag)"
      @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>

    <el-input
      v-if="inputVisible"
      ref="saveTagInput"
      v-model="inputValue"
      class="input-new-tag"
      size="small"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button v-else class="button-new-tag" size="small" @click="showInput">新增标签</el-button>
  </div>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dynamicTags: JSON.parse(JSON.stringify(this.tags)),
      inputVisible: false,
      inputValue: '',
      tempTag: '',
      isChange: false // 是否改变原来的值
    }
  },
  methods: {
    // *关闭标签
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      this.update()
    },

    // *输入框显示
    showInput() {
      this.tempTag = ''
      this.inputVisible = true
      this.inputValue = ''
      this.isChange = false

      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    // *输入框聚焦事件 > 确认
    handleInputConfirm() {
      let inputValue = this.inputValue
      // 去空格
      inputValue = inputValue.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
      if (inputValue === '') {
        this.inputVisible = false
        return
      }
      // 判断是否修改原有值，是 替换修改好的值，否新增
      if (this.isChange) {
        this.dynamicTags[this.dynamicTags.indexOf(this.tempTag)] = this.inputValue
        this.inputVisible = false
        return
      }
      // 点击添加时，追加
      if (inputValue) this.dynamicTags.push(inputValue)

      this.inputVisible = false
      this.inputValue = ''
      this.update()
    },

    // *标签值改变
    changeValue(tag) {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
      this.inputValue = tag
      this.tempTag = tag
      this.isChange = true
      this.update()
    },
    update() {
      this.$emit('update:tags', this.dynamicTags)
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-tag{
    cursor: pointer;
    margin-right: 15px;
  }
  .input-new-tag {
    width: 20%;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
