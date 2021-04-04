<template>
  <div>
    <!-- <a-form-model ref="ruleForm" :model="form2" :label-col="labelCol" :wrapper-col="wrapperCol"> -->
    <a-row class="header">
      选择楼宇:
      <a-select style="width:100px;" v-model="form2.building" @change="changeBuilding()">
        <a-select-option :key="index" :value="item.buildingCode" v-for="(item, index) in buildingSelect">
          {{ item.buildingName }}
        </a-select-option>
      </a-select>
      选择单元:
      <a-select style="width:100px;" v-model="form2.unit" @change="changeUnit()">
        <a-select-option :key="index" :value="item.unitCode" v-for="(item, index) in unitSelect">
          {{ item.unitName }}
        </a-select-option>
      </a-select>
      建筑面积:
      <a-input v-model="form2.buildingArea" style="width: 40px;padding: 0;text-align: center;" @change="changeBuildingArea()"></a-input>
      使用面积:
      <a-input v-model="form2.usedArea" style="width: 40px;padding: 0;text-align: center;" @change="changeUsedArea()"></a-input>
    </a-row>
    <a-row>
      <a-table :columns="columns" :dataSource="data" bordered align="center">
        <template
          v-for="col in [
            'floorNumber',
            'cellCode',
            'cellBuildArea',
            'cellUsedArea',
            'remark'
          ]"
          :slot="col"
          slot-scope="text, record"
        >
          <div :key="col">
            <a-input
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              @change="e => handleChange(e.target.value, record.key, col)"
            />
            <template v-else>{{ text }}</template>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <div class="editable-row-operations">
            <span v-if="record.editable">
              <a @click="() => save(record.key)">保存</a>&nbsp;
              <a-popconfirm title="确认取消吗?" @confirm="() => cancel(record.key)">
                <a>取消</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a :disabled="editingKey !== ''" @click="() => edit(record.key)">编辑</a>
            </span>
          </div>
        </template>
      </a-table>
      <a-row>
        <a-button type="primary" @click="nextStep()">下一步</a-button>&nbsp;
        <a-button type="primary" @click="prevStep()">上一步</a-button>
      </a-row>
    </a-row>
  </div>
</template>

<script>
import { insertctCell, updateCell, selectBuildingName, selectUnitName, selectCell } from '@/api/estate'
const QS = require('qs')
const columns = [
    {
        align: 'center',
        title: '楼层数',
        dataIndex: 'floorNumber',
        width: '6%',
        scopedSlots: { customRender: 'floorNumber' }
    },
    {
        align: 'center',
        title: '房间编码',
        dataIndex: 'cellCode',
        width: '6%',
        scopedSlots: { customRender: 'cellCode' }
    },
    {
        align: 'center',
        title: '建筑面积',
        dataIndex: 'cellBuildArea',
        width: '6%',
        scopedSlots: { customRender: 'cellBuildArea' }
    },
    {
        align: 'center',
        title: '使用面积',
        dataIndex: 'cellUsedArea',
        width: '7%',
        scopedSlots: { customRender: 'cellUsedArea' }
    },
    {
        align: 'center',
        title: '备注',
        dataIndex: 'remark',
        width: '38%',
        scopedSlots: { customRender: 'remark' }
    },
    {
        align: 'center',
        title: '编辑',
        width: '7%',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' }
    }
]
const data = []
export default {
    name: 'Step4',
    data() {
        this.cacheData = data.map(item => ({ ...item }))
        return {
            buildingSelect: [],
            unitSelect: [],
            labelCol: { span: 2 },
            wrapperCol: { span: 1 },
            form2: {
                name: '',
                region: undefined,
                date1: undefined,
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            data,
            columns,
            editingKey: ''
        }
    },
    created() {
        insertctCell(this.$store.state.threeStep.cellMessage).then(res => {
            const result = res.result
            for (let i = 0; i < result.length; i++) {
                const cell = result[i]
                data.push({
                    key: cell.id,
                    floorNumber: cell.floorNumber,
                    unitCode: cell.unitCode,
                    cellCode: cell.cellCode,
                    cellName: cell.cellName,
                    cellBuildArea: cell.cellBuildArea,
                    cellUsedArea: cell.cellUsedArea,
                    remark: cell.remark
                })
            }
            this.cacheData = data.map(item => ({ ...item }))
        }).catch(err => {
            this.$notification['error']({
                message: '错误',
                description: ((err.response || {}).data || {}).message || '获取单元数据',
                duration: 4
            })
        })
        // 查询存在的楼宇
        selectBuildingName(QS.stringify({ estateCode: this.$store.state.threeStep.estateCode })).then(res => {
            this.buildingSelect = res.result
        }).catch(err => {
            this.$notification['error']({
                message: '错误',
                description: ((err.response || {}).data || {}).message || '获取楼宇信息失败',
                duration: 4
            })
        })
    },
    methods: {
        changeUnit() {
            selectCell(QS.stringify({ unitCode: this.form2.unit })).then(res => {
                const result = res.result
                console.log('size:' + result.length)
                const myData = []
                for (let i = 0; i < result.length; i++) {
                    const cell = result[i]
                    console.log('i:' + i)
                    myData.push({
                        key: cell.id,
                        floorNumber: cell.floorNumber,
                        unitCode: cell.unitCode,
                        cellCode: cell.cellCode,
                        cellName: cell.cellName,
                        cellBuildArea: cell.cellBuildArea,
                        cellUsedArea: cell.cellUsedArea,
                        remark: cell.remark
                    })
                }
                this.data = myData
                this.cacheData = myData.map(item => ({ ...item }))
            }).catch(err => {
                this.$notification.error({
                    message: '错误',
                    description: '插入房间失败' + err.result,
                    duration: 4
                })
            })
        },
        changeBuilding() {
            selectUnitName(QS.stringify({ buildingCode: this.form2.building })).then(res => {
                this.unitSelect = res.result
            }).catch(err => {
                this.$notification['error']({
                    message: '错误',
                    description: ((err.response || {}).data || {}).message || '获取单元信息失败',
                    duration: 4
                })
            })
        },
        nextStep() {
            this.$emit('nextStep')
            console.log(33)
        },
        prevStep() {
            this.$emit('prevStep')
        },
        handleChange(value, key, column) {
            const newData = [...this.data]
            const target = newData.filter(item => key === item.key)[0]
            if (target) {
                target[column] = value
                this.data = newData
            }
        },
        edit(key) {
            const newData = [...this.data]
            const target = newData.filter(item => key === item.key)[0]
            this.editingKey = key
            if (target) {
                target.editable = true
                this.data = newData
            }
        },
        save(key) {
            console.log(key)
            const newData = [...this.data]
            const newCacheData = [...this.cacheData]
            const target = newData.filter(item => key === item.key)[0]
            const targetCache = newCacheData.filter(item => key === item.key)[0]
            console.log(targetCache)
            if (target && targetCache) {
                console.log(1111)
                delete target.editable
                this.data = newData
                Object.assign(targetCache, target)
                this.cacheData = newCacheData
                this.editingKey = ''
            }
            target.id = key
            const param = QS.stringify(target)
            updateCell(param).then(res => {
                this.$notification.success({
                    message: '恭喜你',
                    description: res.message
                })
            }).catch(err => {
                this.$notification.error({
                    message: 'error',
                    description: ((err.response || {}).data || {}).message || '添加单元信息失败',
                    duration: 1
                })
            })
        },
        cancel(key) {
            const newData = [...this.data]
            const target = newData.filter(item => key === item.key)[0]
            this.editingKey = ''
            if (target) {
                Object.assign(target, this.cacheData.filter(item => key === item.key)[0])
                delete target.editable
                this.data = newData
            }
        },
        changeBuildingArea() {
            const buildingArea = this.form2.buildingArea
            console.log(this.data)
            for (let i = 0; i < this.data.length; i++) {
                this.data[i].cellBuildArea = buildingArea
            }
        },
        changeUsedArea() {
            const usedArea = this.form2.usedArea
            console.log(this.data)
            for (let i = 0; i < this.data.length; i++) {
                this.data[i].cellUsedArea = usedArea
            }
        }
    },
    beforeDestroy() {
        //  clearTimeout(this.timer)
    }
}
</script>

<style lang="less" scoped>
.stepFormText {
    margin-bottom: 24px;

    .ant-form-item-label,
    .ant-form-item-control {
        line-height: 22px;
    }
}
</style>
