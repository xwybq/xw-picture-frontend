<template>
  <div id="userManagePage">
    <!--    搜索表单-->
    <a-form layout="inline" :model="searchParam" @finish="doSearch">
      <a-form-item label="账号">
        <a-input v-model:value="searchParam.userAccount" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item label="用户名">
        <a-input v-model:value="searchParam.userName" placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item label="用户角色">
        <a-radio-group v-model:value="searchParam.userRole">
          <a-radio-button value="admin">管理员</a-radio-button>
          <a-radio-button value="user">普通用户</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>

    <div style="margin-bottom: 20px"></div>
    <!--    表格-->
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="doTableChange"
    >
      <template #headerCell="{ column }">
        <template v-if="column.key === 'name'">
          <span>
            <smile-outlined />
            Name
          </span>
        </template>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userAvatar'">
          <a-image
            :src="record.userAvatar"
            :preview-src-list="[record.userAvatar]"
            alt="avatar"
            style="
              width: 40px;
              height: 40px;
              border-radius: 50%;
              overflow: hidden; /* 裁剪超出圆形的部分 */
              display: inline-block; /* 保证容器尺寸生效 */
            "
          >
          </a-image>
        </template>
        <template v-else-if="column.dataIndex === 'userRole'">
          <div v-if="record.userRole === 'admin'">
            <a-tag color="geekblue">管理员</a-tag>
          </div>
          <div v-else>
            <a-tag color="green">普通用户</a-tag>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.dataIndex === 'updateTime'">
          {{ dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button danger @click="doDelete(record.id)"> 删除</a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { deleteUserUsingPost, listUserByPageUsingPost } from '@/api/userController.ts'
import dayjs from 'dayjs'
import { userUsingDelete } from '@/api/basicController.ts'
import { message } from 'ant-design-vue'
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
    key: 'userAccount',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
    key: 'userAvatar',
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
    key: 'userProfile',
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
    key: 'userRole',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
  },
]

/**
 * 分页查询用户列表
 */
const dataList = ref<API.UserVO[]>([])
const total = ref(0)
/**
 * 分页查询用户列表参数
 */
const searchParam = reactive<API.UserQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'ascend',
})

const pagination = computed(() => {
  return {
    current: searchParam.current,
    pageSize: searchParam.pageSize,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total: any) => `共 ${total} 条`,
  }
})

//获取数据
const fetchData = async () => {
  const res = await listUserByPageUsingPost({
    ...searchParam,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  }
}

/**
 * 表格分页改变时触发
 */
const doTableChange = (pagination: any) => {
  searchParam.current = pagination.current
  searchParam.pageSize = pagination.pageSize
  fetchData()
}

/**
 * 搜索按钮点击时触发
 */
const doSearch = () => {
  searchParam.current = 1
  fetchData()
}

/**
 * 删除用户
 */
const doDelete = async (id: number) => {
  if (!id) {
    return
  }
  const res = await deleteUserUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    await fetchData()
  } else {
    message.error(res.data.message || '删除失败')
  }
}

onMounted(() => {
  fetchData()
})
</script>
