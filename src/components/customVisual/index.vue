<template>
  <div class="wrapper">
    <div class="custom-form">
      <el-form ref="form" :model="model" label-width="110px">
        <el-button size="small" @click="openCreatModuleDialog">新增模块</el-button>
        <draggable
          :animation="300"
          :list="formData"
          handle=".move"
          item-key="mid"
          drag-class="dragClass"
          ghost-class="ghostClass"
        >
          <el-form-item v-for="element in formData" :key="element.mid" :label="element.module">
            <el-button icon="el-icon-rank" size="mini" circle class="move" />
            <el-popconfirm
              confirm-button-text="好的"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="该操作将此模块数据？"
              @confirm="removeModuleAll(element)"
            >
              <template #reference>
                <el-button class="delete-module" size="mini" type="text">删除模块</el-button>
              </template>
            </el-popconfirm>
            <div v-if="element.tag" class="custom">
              <!-- <el-button class="delete" size="mini" icon="el-icon-delete" circle @click="removeModule(element,'tag')" /> -->
              <custom-tag :tags.sync="element.tag" @update:tags="val => element.tag = val" />
            </div>
            <div v-if="element.table" class="custom">
              <!-- <el-button class="delete" size="mini" icon="el-icon-delete" circle @click="removeModule(element,'table')" /> -->
              <custom-table
                :table.sync="element.table.customTable"
                :head.sync="element.table.customHead"
                @update:table="val => element.table.customTable = val"
                @update:head="val => element.table.customHead = val"
              />
            </div>
          </el-form-item>
        </draggable>

        <el-form-item>
          <!-- <el-button type="primary" size="small" @click="onSubmit">保存表单</el-button> -->
          <!-- <el-button type="primary" size="small" @click="createJson">生成JSON</el-button> -->
        </el-form-item>
      </el-form>

      <!-- 新增模块 -->
      <el-dialog
        :visible.sync="dialog.visible"
        :modal="false"
        title="新建模块"
        width="40%"
        draggable
      >
        <el-form>
          <el-form-item size="small" label="模块名称：">
            <el-input v-model.trim="dialog.input" />
          </el-form-item>
          <el-form-item size="small" label="模块配置：">
            <el-checkbox-group v-model="dialog.checked" border>
              <el-checkbox label="table" />
              <el-checkbox label="tag" />
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button size="small" @click="dialog.visible = false">取消</el-button>
            <el-button
              size="small"
              type="primary"
              @click="creatModule"
            >创建</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 生成JSON -->
      <el-dialog
        :visible.sync="jsonData.visible"
        :modal="false"
        title="生成JSON"
        width="70%"
        draggable
      >
        <pre>{{ jsonData }}</pre>
      </el-dialog>
    </div>
    <div>
      <el-button class="btn" type="primary" size="small" @click="onSubmit">保存表单</el-button>
    </div>
  </div>
</template>

<script>
import { formData } from './formData'
import customTag from './CustomTag.vue'
import customTable from './CustomTable.vue'
import draggable from 'vuedraggable'
export default {
  components: { customTag, customTable, draggable },
  props: {
    visualizationStructre: {
      type: String,
      default: ''
    },
    visualizationJson: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // *生成json弹框
      jsonData: {
        visible: false,
        source: []
      },
      // *新建表单弹框
      dialog: {
        visible: false,
        input: '',
        checked: []
      },
      // *表单模块配置
      formOption: {},
      // *表单数据源
      formData: JSON.parse(this.visualizationStructre),
      // formData,
      model: {
        formData: JSON.parse(this.visualizationStructre)
      }
    }
  },

  methods: {
    // *新建模块 => 打开对话框
    openCreatModuleDialog() {
      this.dialog.visible = true
      this.dialog.input = ''
      this.dialog.checked = []
    },

    // *保存 => 创建表单模块
    creatModule() {
      if (!this.dialog.input) return this.$message.warning('请输入模块名称')
      if (this.dialog.checked.length === 0) return this.$message.warning('请选择模块配置')

      const formOptionCopy = JSON.parse(JSON.stringify(this.formOption))
      formOptionCopy.module = this.dialog.input
      for (const v of this.dialog.checked) {
        if (v === 'tag') formOptionCopy[v] = []
        if (v === 'table') formOptionCopy[v] = {}
      }
      this.formData.push(formOptionCopy)
      this.dialog.visible = false
    },

    // *删除子表单模块
    removeModule(item, type) {
      delete item[type]
    },

    // *删除表单模块
    removeModuleAll(item) {
      this.formData = this.formData.filter(v => v !== item)
    },

    // *保存总表单
    onSubmit() {
      this.createJson()
      this.$emit('update:formData', JSON.stringify(this.formData))
      this.$emit('update:jsonData', JSON.stringify(this.jsonData))
      this.$message.success('保存成功')
    },

    // *生成Json数据
    createJson() {
      // this.jsonData.visible = true
      this.jsonData.source.length = 0
      for (const i in this.formData) {
        const list = this.formData[i]
        if (list?.table?.customTable) {
          // *表格组件生成json
          const module = {
            name: list.module,
            data: []
          }
          const resultArr = JSON.parse(JSON.stringify(list.table.customTable))
          const childArr = this.filterFormKey(resultArr)
          module.data = this.bindParent(resultArr, childArr)
          this.jsonData.source.push(module)
        }
        if (list?.tag) {
          // *标签组件生成json
          const module = {
            name: list.module,
            data: JSON.parse(JSON.stringify(list.tag))
          }
          this.jsonData.source.push(module)
        }
      }
    },

    // todo表格组件生成json => 递归过滤表单数组中的key值
    filterFormKey(arr) {
      const newArr = []
      for (const i in arr) {
        const children = arr[i].children || []
        for (const j in children) {
          const customTable = children[j].customTable || []
          const _newArr = []
          for (const v of customTable) {
            v.parentId = children[j].parentId
            if (v.children) {
              _newArr.push(v)
              v.children = this.filterFormKey(_newArr)
            }
          }
          newArr.push(...customTable)
        }
      }
      return newArr
    },

    // todo表格组件生成json => 将子级绑定到父级对象中
    bindParent(resultArr, childArr) {
      resultArr.forEach(v => {
        v.children = []
        childArr.forEach(x => {
          if (v.prop_id === x.parentId) {
            v.children.push(x)
          }
        })
      })
      return resultArr
    },

    syncData() {
      this.$emit('update:jsonData', JSON.stringify(this.jsonData))
    }

  }
}
</script>

<style lang="scss" scoped>
.custom-form{
  padding: 20px 40px 20px 20px;
  overflow: auto scroll;
  max-height: 100%;
  .custom{
    width: 100%;
    border: 1px dashed #999;
    margin: 15px auto;
    padding: 10px;
    position: relative;
    .delete{
      position: absolute;
      right: -10px;
      top: -15px;
      cursor: pointer;
    }
  }
  .delete-module{
    position: absolute;
    right: 15px;
    top: 25px;
    z-index: 9;
  }
  .move{
    position: absolute;
    right: 130px;
    top: 0px;
    cursor: move;
  }
  ::v-deep .el-form-item__label{
    font-weight: bold;
    font-size: 16px;
  }
}
.wrapper{
  position: relative;
}
.btn{
  position: relative;
  right: 0;
  margin-top: 20px;
}

// 拖拽
.dragClass {
  background: rgba($color: #6cacf5, $alpha: 0.5) !important;
  border: 1px dashed #666;
}

// 停靠
.ghostClass {
  background: rgba($color: #6cacf5, $alpha: 0.5) !important;
  border: 1px dashed #666;
  cursor: move;
}

</style>
