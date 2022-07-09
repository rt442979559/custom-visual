<template>
  <div ref="zbk" class="table-zbk">
    表格组件：
    <el-button size="small" style="margin-right: 10px" @click="addRow({})">新增行</el-button>
    <el-dropdown size="small" split-button @click="addCol(null)" @command="handleImportCommand">
      新增列
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="file">文件列</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <span style="margin-right: 10px" />
    <el-dropdown @command="handleImportCommand">
      <el-button size="small" style="margin-right: 10px">
        导入<i class="el-icon-arrow-down el-icon--right" />
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="add">新增导入</el-dropdown-item>
        <el-dropdown-item command="cover">覆盖导入</el-dropdown-item>
        <el-dropdown-item command="temp">导入模板下载</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-switch
      v-model="move"
      active-color="#13ce66"
      inactive-color="#ff4949"
      @change="destroySortable"
    />
    <input
      v-show="false"
      ref="inputEl"
      type="file"
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      @change="importData"
    >
    <el-table
      ref="dragTable"
      height="300px"
      border
      stripe
      :data="tableData"
      highlight-current-row
      row-key="prop_id"
      style="width: 100%"
      :row-class-name="tableRowClassName"
      :tree-props="{ children: 'gggggg', hasChildren: 'hasChildren' }"
    >
      <el-table-column v-for="(item, i) in tableHead" :key="i" min-width="150" :label="item.label" :prop="item.prop" :remark="item.remark">
        <template #header>
          <div class="flex">
            <div style="flex:1">
              <el-tooltip
                style="margin-bottom:10px"
                effect="dark"
                :content="item.prop"
                placement="top"
              >
                <el-input v-model="item.prop" placeholder="字段" size="small" />
              </el-tooltip>
              <el-tooltip
                effect="light"
                :content="item.remark"
                placement="top"
              >
                <el-input v-model="item.remark" placeholder="中文备注" size="small" />
              </el-tooltip>
            <!-- <el-switch
              v-model="item.disabled"
              inline-prompt
              icon="el-icon-info"
            /> -->
            </div>
            <el-popconfirm
              confirm-button-text="好的"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="该操作将删除这列数据？"
              @confirm="delCol(item)"
            >
              <template #reference>
                <el-button type="text" icon="el-icon-delete" />
              </template>
            </el-popconfirm>
          </div>
        </template>
        <template #default="scope">
          <buttonFile v-if="item.type === 'file'" :value.sync="scope.row[item.prop]" />
          <div v-else>
            <el-input
              v-if="item.elementType === 'el-input'"
              v-model="scope.row[item.prop]"
              size="small"
              :disabled="item.prop === 'prop_id'"
              @keyup.enter="handleInputConfirm"
              @blur="handleInputConfirm"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template #default="scope">
          <el-button
            type="text"
            size="small"
            @click="delRow(scope.row)"
          >删除</el-button>
          <el-button
            type="text"
            size="small"
            @click="copyRow(scope.row, scope.$index)"
          >复制</el-button>
          <el-button
            type="text"
            size="small"
            @click="editRow(scope.row)"
          >编辑子表单</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :modal="false" title="子表单" width="84%" draggable>
      <el-form>
        <el-form-item>
          <el-popover
            v-model:visible="component.visible"
            placement="bottom"
            :width="260"
            trigger="click"
          >
            <div class="radio-box">
              <el-radio v-model="component.type" disabled label="tag" size="small" border>子标签组件</el-radio>
              <el-radio v-model="component.type" label="table" size="small" border>子表格组件</el-radio>
            </div>
            <div class="button-box">
              <el-button size="small" @click="creatCancel">取消</el-button>
              <el-button size="small" type="primary" @click="creatFormChild(component.type)">确定</el-button>
            </div>

            <template #reference>
              <el-button size="small"> 新增子表单 </el-button>
            </template>
          </el-popover>
        </el-form-item>
        <el-form-item size="small">
          <div v-for="(item,i) in tableData" :key="i">
            <div v-for="(child,j) in item.children" :key="j">
              <div v-if="child.parentId === component.parentId">
                <custom-table
                  class="custom"
                  :table.sync="child.customTable"
                  :head.sync="child.customHead"
                  @update:table="val => child.customTable = val"
                  @update:head="val => child.customHead = val"
                />
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="dialogVisible = false">取消</el-button>
          <el-button
            size="small"
            type="primary"
            @click="save"
          >保存子表单</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { randomWord } from '@/utils/random'
import Sortable from 'sortablejs'
import XLSX from 'xlsx/dist/xlsx.mini.min.js'
import FileSaver from 'file-saver'
import buttonFile from './buttonFile.vue'

export default {
  name: 'CustomTable',
  components: {
    buttonFile
  },
  props: {
    table: {
      type: Array,
      default: () => []
    },
    head: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      move: false,
      sort: '',
      component: {
        visible: false,
        type: '',
        parentId: ''
      },
      // *子表单
      formChild: {
        table: {
          name: 'table',
          type: 'table',
          customHead: [],
          customTable: []
        },
        tag: {
          name: 'tag',
          type: 'tag',
          tags: []
        }
      },
      importType: '',
      dialogVisible: false,
      tableData: JSON.parse(JSON.stringify(this.table)),
      tableHead: JSON.parse(JSON.stringify(this.head))
    }
  },
  mounted() {
    // this.initSortable()
  },
  methods: {
    // todo拖拽表格行
    initSortable() {
      const el = this.$refs.zbk
      const tbody = el.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      this.sort = Sortable.create(tbody, {
        animation: 150, // 动画
        // handle: '.move', // 指定拖拽目标，点击此目标才可拖拽元素(此例中设置操作按钮拖拽)
        filter: '.disabled', // 指定不可拖动的类名（el-table中可通过row-class-name设置行的class）
        dragClass: 'dragClass', // 设置拖拽样式类名
        ghostClass: 'ghostClass', // 设置拖拽停靠样式类名
        chosenClass: 'chosenClass', // 设置选中样式类名
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0]
          _this.tableData.splice(newIndex, 0, currRow)
          _this.$emit('update:table', _this.tableData)
        }
      })
    },
    destroySortable() {
      if (this.move === true) {
        this.initSortable()
      } else {
        this.sort.destroy()
      }
    },
    // *表格行样式
    tableRowClassName({ row }) {
      if (row.disabled) {
        return 'disabled'
      }
      return ''
    },
    // *监听输入框更新
    handleInputConfirm() {
      this.upData()
    },
    // 新增列
    handleColumnCommand(command) {
      if (command === 'file') {
        //
      }
    },
    // 导入
    handleImportCommand(command) {
      if (command === 'file') {
        this.addCol('file')
      } else if (command === 'temp') {
        this.downloadTemp()
      } else {
        this.importType = command
        this.$refs.inputEl.click()
      }
    },
    importData(event) {
      if (event.currentTarget.files.length === 0) {
        return
      }
      var f = event.currentTarget.files[0]
      event.currentTarget.value = null
      var reader = new FileReader()
      // 表头对应
      const headerReplace = {}
      this.tableHead.forEach(li => {
        headerReplace[li.prop] = `${li.prop}（${li.remark}）`
      })

      if (this.importType === 'cover') {
        // 覆盖导入
        this.tableData = []
      }

      FileReader.prototype.readAsBinaryString = (f) => {
        var binary = ''
        var wb // 读取完成的数据
        var reader = new FileReader()
        reader.onload = (e) => {
          // 读取成Uint8Array，再转换为Unicode编码（Unicode占两个字节）
          var bytes = new Uint8Array(reader.result)
          var length = bytes.byteLength
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          // 接下来就是xlsx了，具体可看api
          wb = XLSX.read(binary, {
            type: 'binary'
          })
          XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]).forEach(li => {
            const ret = {}
            for (const key in headerReplace) {
              ret[key] = li[headerReplace[key]] || ''
            }
            this.addRow(ret)
          })
        }
        reader.readAsArrayBuffer(f)
      }
      reader.readAsBinaryString(f)
    },
    workbook2blob(workbook) {
      // 生成excel的配置项
      var wopts = {
        // 要生成的文件类型
        bookType: 'xlsx',
        // // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        bookSST: false,
        type: 'binary'
      }
      var wbout = XLSX.write(workbook, wopts)
      // 将字符串转ArrayBuffer
      function s2ab(s) {
        var buf = new ArrayBuffer(s.length)
        var view = new Uint8Array(buf)
        for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
        return buf
      }
      var blob = new Blob([s2ab(wbout)], {
        type: 'application/octet-stream'
      })
      return blob
    },
    downloadTemp() {
      // 表头
      const header = []
      // 替换表头
      const headerReplace = {}
      this.tableHead.forEach(li => {
        header.push(li.prop)
        headerReplace[li.prop] = `${li.prop}（${li.remark}）`
      })
      // skipHeader:true，忽略表头
      var worksheet = XLSX.utils.json_to_sheet([headerReplace], { header, skipHeader: true })

      var wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, worksheet, 'sheet1')
      const workbookBlob = this.workbook2blob(wb)
      FileSaver(workbookBlob, '模板.xlsx')
    },
    // *编辑子表单
    editRow(row) {
      this.component.parentId = row.prop_id
      this.dialogVisible = true
    },
    // *添加表格行
    addRow(info) {
      const prop_id = randomWord()
      if (this.tableHead.length === 0) {
        this.tableData.push({ prop_id })
      } else {
        const data = {}
        const params = ['prop_id', ...this.tableHead.map(li => li.prop)]
        console.log(params)
        for (const v of params) {
          v === 'prop_id' ? data[v] = prop_id : data[v] = (info[v] || '')
        }
        this.tableData.push(data)
      }
      this.upData()
    },
    // *删除表格行
    delRow(row) {
      this.tableData = this.tableData.filter(v => v !== row)
      this.upData()
    },
    // *添加表格列
    addCol(type) {
      this.tableHead.push({
        elementType: 'el-input',
        prop: '',
        remark: '',
        type: type || 'input'
      })
      this.upData()
    },
    // *复制行
    copyRow(row, i) {
      const rowCopy = JSON.parse(JSON.stringify(row))
      const _key = randomWord()
      rowCopy.prop_id = _key
      if (rowCopy.children) {
        rowCopy.children.forEach(v => { v.parentId = _key })
      }
      this.tableData.splice(i + 1, 0, rowCopy)
      this.upData()
    },
    // *删除表格列
    delCol(item) {
      this.tableHead = this.tableHead.filter(v => v !== item)
      if (item.prop !== 'prop_id') {
        this.tableData.forEach(element => {
          delete element[item.prop]
        })
      }
      this.upData()
    },
    // *更新数据
    upData() {
      // todo过滤表格列数据中为undefined的值
      // this.tableHead.forEach(v => {
      //   this.tableData.forEach(m => {
      //     // arr.push(m[v.prop])
      //     for (const i in m) {
      //       console.log(i)
      //     }
      //   })
      // })

      this.$emit('update:table', this.tableData)
      this.$emit('update:head', this.tableHead)
    },

    // *创建子表单
    creatFormChild(type) {
      if (!type) return this.$message.warning('请选择要创建的子表单类型')
      this.component.visible = false
      const formChildCopy = JSON.parse(JSON.stringify(this.formChild))
      if (type === 'table') {
        this.tableData.map(v => {
          if (v.prop_id === this.component.parentId) {
            v.children ? '' : v.children = []
            const data = Object.assign({}, formChildCopy[this.component.type], { parentId: this.component.parentId })
            v.children.push(data)
          }
        })
      }
    },
    // *取消创建子表单
    creatCancel() {
      this.component.visible = false
    },
    // *保存子表单
    save() {
      this.upData()
      this.dialogVisible = false
    }
  }
}
</script>

<style lang='scss'>
// 拖拽
.dragClass {
  background: rgba($color: #41c21a, $alpha: 0.5) !important;
}
// 停靠
.ghostClass {
  background: rgba($color: #6cacf5, $alpha: 0.5) !important;
}
// 选择
.chosenClass:hover > td {
  background: rgba($color: #f56c6c, $alpha: 0.5) !important;
}
.radio-box{
  margin-bottom: 20px;
}
.button-box{
  float:right;
}
.custom{
  border: 1px dashed #666;
  margin: 10px auto;
  padding: 10px;
}
.flex{
  display: flex;
  justify-content: space-between;
  align-items: center;
  .el-input{
    flex: 0.42;
  }
}
</style>

<style lang="scss" scoped>
.table-zbk {
  ::v-deep .el-button {
    height: 32px;
  }
}
</style>
