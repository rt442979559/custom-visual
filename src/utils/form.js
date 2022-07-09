export function ensureFormDataCorrect(formData, fieldCompMap) {
  // for (let key in formData) {
  //   let value = fieldCompMap[key]
  //   let type = value ? value.type : ''
  //   if (
  //     type === 'checkbox' ||
  //     type === 'upload' ||
  //     (type === 'select' && value.options.multiple)
  //   ) {
  //     if (typeof formData[key] === 'string') {
  //       try {
  //         let char = formData[key].charAt(0)
  //         if (char === '[' || char === '{') {
  //           formData[key] = JSON.parse(formData[key])
  //         }
  //       } catch (error) {
  //         console.log(error)
  //         // formData[key] = formData[key]|| []
  //       }
  //     }
  //   }
  // }
  // return formData
  for (const model in formData) {
    formData[model] = ensureDataTypeCorrect(
      model,
      formData[model],
      fieldCompMap
    )
  }
  return formData
}

export function ensureDataTypeCorrect(model, value, fieldCompMap) {
  const comp = fieldCompMap[model]
  const type = comp ? comp.type : ''
  if (
    type === 'checkbox' ||
    type === 'upload' ||
    (type === 'select' && comp.options.multiple)
  ) {
    if (typeof value === 'string') {
      try {
        const char = value.charAt(0)
        if (char === '[' || char === '{') {
          return JSON.parse(value)
        }
      } catch (error) {
        console.log(error)
        // formData[key] = formData[key]|| []
      }
    }
  }

  return value
}

import store from '@core/store'

export const remote = {
  autoRead: (type, set) => {
    const userInfo = store.getters['user/userInfo']
    if (type === 'username') {
      set(userInfo.fullname)
    } else if (type === 'phone') {
      set(userInfo.mobile)
    }
  },
  selectData: cb => {
    cb([
      {
        label: 'c-1',
        value: 'c-1'
      },
      {
        label: 'c-2',
        value: 'c-2'
      },
      {
        label: 'c-3',
        value: 'c-3'
      }
    ])
  },
  radioData: cb => {
    cb([
      {
        label: 'r-1',
        value: 'r-1'
      },
      {
        label: 'r-2',
        value: 'r-2'
      },
      {
        label: 'r-3',
        value: 'r-3'
      }
    ])
  },
  uploadHeaders: {
    Authorization: `Bearer ${store.getters['user/token']}`
  }
}

export function loadFieldsRemoteData(plainFormConfig) {
  if (plainFormConfig && plainFormConfig.list) {
    // 加载远端数据
    plainFormConfig.list.forEach(comp => {
      if (comp.options.remote) {
        const loadRemoteDatafunc = remote[comp.options.remoteFunc]
        if (loadRemoteDatafunc) {
          loadRemoteDatafunc(data => {
            comp.options.options = data.map(item => {
              return {
                value: item[comp.options.props.value],
                label: item[comp.options.props.label],
                children: item[comp.options.props.children]
              }
            })
          })
        }
      }
    })
    // 提取选项数据
    const fieldsRemoteData = {}
    plainFormConfig.list.forEach(comp => {
      const type = comp.type
      if (['checkbox', 'select', 'radio'].includes(type)) {
        const map = {}
        comp.options.options.forEach(item => {
          map[item.value] = item.label ? item.label : item.value
          // return {
          //   value: item.value,
          //   label: item.label ? item.label : item.value
          // }
        })
        fieldsRemoteData[comp.model] = map
      }
    })
    return fieldsRemoteData
  }
}

export function plainFieldsModelMap(plainFormConfig) {
  const res = {}
  if (plainFormConfig && plainFormConfig.list) {
    plainFormConfig.list.forEach(item => {
      res[item.model] = item
    })
  }
  return res
}

export function getVisibleFields(plainFormConfig, fieldsPermissionMap) {
  if (plainFormConfig && plainFormConfig.list) {
    let res = []
    if (fieldsPermissionMap === 'all') {
      res = plainFormConfig.list
    } else if (fieldsPermissionMap) {
      res = plainFormConfig.list.filter(item => {
        return fieldsPermissionMap[item.model]
      })
    }

    return res.filter(item => !['blank', 'line-break'].includes(item.type))
  }
  return []
}

function forEachComp(list, cb, jumpOver = []) {
  for (let i = 0; i < list.length; i++) {
    const comp = list[i]

    if (jumpOver.includes(comp.type)) {
      continue
    }

    if (comp.type === 'grid' || comp.type === 'sub-form') {
      comp.columns.forEach(item => {
        forEachComp(item.list, cb)
      })
    } else if (comp.type === 'custom-table' || comp.type === 'condition-link') {
      comp.columns.forEach(tr => {
        tr.forEach((item, cellIndex) => {
          if (item.data.length > 0) {
            forEachComp(item.data, cb)
          }
        })
      })
    }

    const key = comp.model
    cb(i, key, comp)
  }
}

function foreachRootComp(list, cb, types = []) {
  for (let i = 0; i < list.length; i++) {
    const comp = list[i]
    if (types.includes(comp.type)) {
      const key = comp.model
      cb(i, key, comp)
    }
  }
}

export function genFieldCompMap(list) {
  const map = {}
  forEachComp(list, (i, key, comp) => {
    map[key] = comp
  })
  return map
}

export function plainCompList(formConfig) {
  const res = []
  if (formConfig && Array.isArray(formConfig.list)) {
    const special = ['sub-form', 'condition-link']
    forEachComp(
      formConfig.list,
      (i, key, comp) => {
        if (!['custom-table', 'grid'].includes(comp.type)) res.push(comp)
      },
      special
    )
    foreachRootComp(
      formConfig.list,
      (i, key, comp) => {
        res.push(comp)
      },
      special
    )
  }
  return res
}
