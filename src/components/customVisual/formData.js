export const formData = [
  {
    module: '模块1',
    table: {
      // *table => row
      customHead: [
        { label: 'label', prop: 'prop_label', elementType: 'el-input', remark: '测试备注' },
        { label: 'val', prop: 'prop_val', elementType: 'el-input' },
        { label: 'unit', prop: 'prop_unit', elementType: 'el-input' },
        { label: 'id', prop: 'prop_id', elementType: 'el-input', disabled: true },
        { elementType: 'el-input', remark: '1231' }
      ],
      // *table => column
      customTable: [
        {
          prop_label: '山塘水库 level 1 - 1',
          prop_val: '24',
          prop_unit: '个',
          prop_id: 1,
          children: [
            {
              customHead: [
                { label: 'label', prop: 'prop_label', elementType: 'el-input' },
                { label: 'val', prop: 'prop_val', elementType: 'el-input' },
                { label: 'unit', prop: 'prop_unit', elementType: 'el-input' }
              ],
              customTable: [
                {
                  prop_label: 'level 1 - 2',
                  prop_val: '222222222',
                  prop_unit: '个',
                  prop_id: 11,
                  children: [
                    {
                      customHead: [
                        { label: 'label', prop: 'prop_label', elementType: 'el-input' },
                        { label: 'val', prop: 'prop_val', elementType: 'el-input' },
                        { label: 'unit', prop: 'prop_unit', elementType: 'el-input' }
                      ],
                      customTable: [
                        {
                          prop_label: 'level 1 - 3',
                          prop_val: '333333333333',
                          prop_unit: '个',
                          prop_id: 111
                        }
                      ],
                      parentId: 11
                    }
                  ]
                }
              ],
              parentId: 1
            }
          ]
        },
        {
          prop_label: '景区景点 level 2 - 1',
          prop_val: '31',
          prop_unit: '个',
          prop_id: 2,
          children: [
            {
              customTable: [
                {
                  prop_label: 'level 2 - 2',
                  prop_val: '22222222222',
                  prop_unit: '个',
                  prop_id: 22,
                  children: [
                    {
                      customHead: [
                        { label: 'label', prop: 'prop_label', elementType: 'el-input' },
                        { label: 'val', prop: 'prop_val', elementType: 'el-input' },
                        { label: 'unit', prop: 'prop_unit', elementType: 'el-input' }
                      ],
                      customTable: [
                        {
                          prop_label: 'level 3 - 2',
                          prop_val: '333333333333',
                          prop_unit: '个',
                          prop_id: 222
                        }
                      ],
                      parentId: 22
                    }
                  ]
                }
              ],
              customHead: [
                { label: 'label', prop: 'prop_label', elementType: 'el-input' },
                { label: 'val', prop: 'prop_val', elementType: 'el-input' },
                { label: 'unit', prop: 'prop_unit', elementType: 'el-input' }
              ],
              parentId: 2
            }
          ]
        }
      ]
    },
    mid: 1
  },
  { module: '模块2', tag: [], mid: 2 },
  { module: '模块3',
    table: {
      customHead: [
        { label: 'label', prop: 'prop_label', elementType: 'el-input' },
        { label: 'val', prop: 'prop_val', elementType: 'el-input' },
        { label: 'unit', prop: 'prop_unit', elementType: 'el-input' },
        { label: 'id', prop: 'prop_id', elementType: 'el-input', disabled: true }
      ],
      customTable: [
        {
          prop_label: 'test level 3 - 1',
          prop_val: '111',
          prop_unit: '个',
          prop_id: 3
        }
      ]
    },
    tag: ['tag1', 'tag2', 'tag3', 'tag4', 156, 165],
    mid: 3
  }
]
