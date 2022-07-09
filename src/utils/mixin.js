import { mapState, mapActions } from 'vuex'
const mixin = {
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })

  },
  methods: {
    ...mapActions({
      getTargetSelectSingle: 'component/getTargetSelectSingle',
      getTargetSelectData: 'component/getTargetSelectData',
      filterNode: 'component/filterNode',
      createCusetom: 'component/createCusetom',
      updateCusetom: 'component/updateCusetom',
      deleteCustom: 'component/deleteCustom'
    }),
    /**
     * 确认提示窗封装
     * @param {String} text 提示文字
     * @param {Function} callback 确认时的回调函数
     */
    confirmDialog(text, callback) {
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(callback)
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },

    /**
     * 需输入原因的提示框
     * @param {String} text 提示文字
     * @param {Function} callback 确认时的回调函数
     */
    promptDialog(text, callback) {
      this.$prompt(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea'
      })
        .then(callback)
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },

    /**
     * 判空
     * @param {*} object  对象
     */
    isBlank(object) {
      if (object === '' || object === undefined || object == null || JSON.stringify(object) === '{}' || JSON.stringify(object) === '[]') {
        return true
      }
      return false
    },
    /**
     * 简单封装提示
     * @param {*} text 提示内容
     * @param {*} type 类型 默认warning
     */
    simpleConfirm(text, type) {
      type = type || 'warning'
      return new Promise((resolve, reject) => {
        this.$confirm(text, '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: type
        }).then(() => {
          // 调用接口
          // console.log('true')
          resolve()
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // })
          reject()
        })
      })
    }
  }
}
export default mixin
