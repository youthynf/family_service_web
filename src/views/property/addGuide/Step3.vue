<template>
  <div>
    <!-- <a-form-model ref="ruleForm" :model="form2" :label-col="labelCol" :wrapper-col="wrapperCol"> -->
    <a-row class="header">
      楼层数量:
      <a-input style="width: 30px;padding: 0;text-align: center;" @blur="changeFloor()" v-model="form2.floorNumber"></a-input>开始房号:
      <!-- <a-form-model-item label="单元数量：" prop="region" class="units" :labelCol="labelCol" :wrapperCol="wrapperCol"> -->
      <a-select style="width: 50px;padding: 0;text-align: center;" v-model="form2.startCell" @change="changeStartCell()">
        <a-select-option value="1">1</a-select-option>
        <a-select-option value="2">2</a-select-option>
        <a-select-option value="3">3</a-select-option>
        <a-select-option value="4">4</a-select-option>
        <a-select-option value="5">5</a-select-option>
        <a-select-option value="6">6</a-select-option>
        <a-select-option value="7">7</a-select-option>
        <a-select-option value="8">8</a-select-option>
      </a-select>结束房号:
      <!-- <a-form-model-item label="单元数量：" prop="region" class="units" :labelCol="labelCol" :wrapperCol="wrapperCol"> -->
      <a-select style="width: 50px;padding: 0;text-align: center;" v-model="form2.stopCell" @change="changeStopCell()">
        <a-select-option value="1">1</a-select-option>
        <a-select-option value="2">2</a-select-option>
        <a-select-option value="3">3</a-select-option>
        <a-select-option value="4">4</a-select-option>
        <a-select-option value="5">5</a-select-option>
        <a-select-option value="6">6</a-select-option>
        <a-select-option value="7">7</a-select-option>
        <a-select-option value="8">8</a-select-option>
      </a-select>
      <!-- </a-form-model-item> -->
    </a-row>
    <a-row>
      <a-table :columns="columns" :dataSource="data" bordered align="center">
        <template
          v-for="col in [
            'buildingCode',
            'unitCode',
            'unitName',
            'startFloor',
            'stopFloor',
            'startCellId',
            'stopCellId',
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
import { selectUnit, updateUnit } from '@/api/estate'
const QS = require('qs')
const columns = [
    {
        align: 'center',
        title: '楼宇编码',
        dataIndex: 'buildingCode',
        width: '6%',
        scopedSlots: { customRender: 'buildingCode' }
    },
    {
        align: 'center',
        title: '单元编码',
        dataIndex: 'unitCode',
        width: '6%',
        scopedSlots: { customRender: 'unitCode' }
    },
    {
        align: 'center',
        title: '单元名称',
        dataIndex: 'unitName',
        width: '6%',
        scopedSlots: { customRender: 'unitName' }
    },
    {
        align: 'center',
        title: '开始楼层',
        dataIndex: 'startFloor',
        width: '7%',
        scopedSlots: { customRender: 'startFloor' }
    },
    {
        align: 'center',
        title: '结束楼层',
        dataIndex: 'stopFloor',
        width: '7%',
        scopedSlots: { customRender: 'stopFloor' }
    },
    {
        align: 'center',
        title: '开始房号',
        dataIndex: 'startCellId',
        width: '7%',
        scopedSlots: { customRender: 'startCellId' }
    },
    {
        align: 'center',
        title: '结束房号',
        dataIndex: 'stopCellId',
        width: '7%',
        scopedSlots: { customRender: 'stopCellId' }
    },
    {
        align: 'center',
        title: '备注',
        dataIndex: 'remark',
        width: '18%',
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
    name: 'Step3',
    data() {
        this.cacheData = data.map(item => ({ ...item }))
        return {
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
        selectUnit(this.$store.state.twoStep.unitMessage).then(res => {
            const result = res.result
            for (let i = 0; i < result.length; i++) {
                const unit = result[i]
                data.push({
                    key: unit.id.toString(),
                    buildingCode: unit.buildingCode,
                    unitCode: unit.unitCode,
                    unitName: unit.unitName,
                    startFloor: unit.startFloor,
                    stopFloor: unit.stopFloor,
                    startCellId: unit.startCellId,
                    stopCellId: unit.stopCellId,
                    remark: unit.remark
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
    },
    methods: {
        changeFloor() {
            const floorNumber = this.form2.floorNumber
            console.log(this.data)
            for (let i = 0; i < this.data.length; i++) {
                this.data[i].startFloor = 1
                this.data[i].stopFloor = floorNumber
            }
        },
        changeStartCell() {
            const startCell = this.form2.startCell
            for (let i = 0; i < this.data.length; i++) {
                this.data[i].startCellId = startCell
            }
        },
        changeStopCell() {
            const stopCell = this.form2.stopCell
            for (let i = 0; i < this.data.length; i++) {
                this.data[i].stopCellId = stopCell
            }
        },
        nextStep() {
            const dataArray = this.data
            console.log(dataArray)
            let param = '['
            for (let i = 0; i < dataArray.length; i++) {
                if (i !== dataArray.length - 1) {
                    param += '{ "unitCode": "' + dataArray[i].unitCode + '", "startFloor": ' + dataArray[i].startFloor + ', "stopFloor": ' + dataArray[i].stopFloor + ', "startCellId": ' + dataArray[i].startCellId + ', "stopCellId": ' + dataArray[i].stopCellId + '},'
                } else {
                    param += '{ "unitCode": "' + dataArray[i].unitCode + '", "startFloor": ' + dataArray[i].startFloor + ', "stopFloor": ' + dataArray[i].stopFloor + ', "startCellId": ' + dataArray[i].startCellId + ', "stopCellId": ' + dataArray[i].stopCellId + '}'
                }
            }
            param += ']'
            this.$store.commit('SET_TITLE', {
                cellMessage: param,
                estateCode: this.$store.state.twoStep.estateCode
            })
            this.$emit('nextStep')
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
            console.log(target)
            if (target && targetCache) {
                delete target.editable
                this.data = newData
                Object.assign(targetCache, target)
                this.cacheData = newCacheData
                this.editingKey = ''
            }
            target.id = key
            const param = QS.stringify(target)
            updateUnit(param).then(res => {
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
