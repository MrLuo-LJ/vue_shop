<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索 -->
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            class="input-with-select"
            @clear="getUserList"
          >
            <template #append>
              <el-button icon="Search" @click="getUserList()"></el-button>
            </template>
          </el-input>
        </el-col>
        <!-- 添加按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userlist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" @click="showEditDialog(scope.row.id)">修改</el-button>
            <el-button type="primary" @click="removeUserById(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-config-provider :locale="locale">
        <el-pagination
          v-model:currentPage="queryInfo.pagenum"
          v-model:page-size="queryInfo.pagesize"
          :page-sizes="[1, 2, 5, 10]"
          :small="small"
          :disabled="disabled"
          :background="background"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-config-provider>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="添加用户"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主题 -->
      <el-form
        ref="ruleFormRef"
        :model="addForm"
        :rules="rulesFrom"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addUser"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
        v-model="editDialogVisible"
        title="修改用户"
        width="30%"
        @close="editDialogClose"
      >
         <el-form
            ref="editFormRef"
            :model="editFrom"
            status-icon
            :rules="editFromRules"
            label-width="70px"
          >
          <el-form-item label="用户名">
            <el-input v-model="editFrom.username" disabled/>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="editFrom.email" />
          </el-form-item>
          <el-form-item label="手机">
            <el-input v-model="editFrom.mobile" />
          </el-form-item>
         </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="editUserInfo"
              >确定</el-button>
          </span>
        </template>
      </el-dialog>
  </div>
</template>
<script>
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { ElMessageBox } from 'element-plus'
export default {
  data () {
    // var checkMobile = () => {}
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      locale: zhCn,
      dialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rulesFrom: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名长度在3-10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '密码长度在6-15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          {
            type: 'email',
            required: true,
            message: '请输入合法的邮箱',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入电话',
            trigger: 'blur'
          }
        ]
      },
      editDialogVisible: false,
      editFrom: {},
      editFromRules: {
        email: [
          {
            type: 'email',
            required: true,
            message: '请输入合法的邮箱',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入电话',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$axios.get(
        'http://127.0.0.1:8888/api/private/v1/users',
        { params: this.queryInfo }
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userlist = res.data.users
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newCurrent) {
      console.log(newCurrent)
      this.queryInfo.pagenum = newCurrent
      this.getUserList()
    },
    async userStateChanged (userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$axios.put(
        `http://127.0.0.1:8888/api/private/v1/users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      console.log(res.meta.status)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    addDialogClosed () {
      this.$refs.ruleFormRef.resetFields()
    },
    // 点击按钮与验证
    addUser () {
      this.$refs.ruleFormRef.validate(async valid => {
        console.log(valid + 'haha')
        // eslint-disable-next-line no-useless-return
        if (!valid) return
        // eslint-disable-next-line no-unused-vars
        const { data: res } = await this.$axios.post('http://127.0.0.1:8888/api/private/v1/users', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功！！')
        this.dialogVisible = false
        this.getUserList()
      })
    },
    async showEditDialog (id) {
      const { data: res } = await this.$axios.get('http://127.0.0.1:8888/api/private/v1/users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      console.log('haha' + res)
      this.editFrom = res.data
      this.editDialogVisible = true
    },
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        // eslint-disable-next-line no-useless-return
        if (!valid) return
        const { data: res } = await this.$axios.put('http://127.0.0.1:8888/api/private/v1/users/' + this.editFrom.id, { email: this.editFrom.email, mobile: this.editFrom.mobile })
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败')
        }
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('更新成功')
      })
    },
    removeUserById (id) {
      ElMessageBox.confirm(
        '此操作将永久删除用户，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          const { data: res } = await this.$axios.delete('http://127.0.0.1:8888/api/private/v1/users/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error('删除用户失败')
          }
          this.$message.success('删除用户成功')
          this.getUserList()
        })
        .catch(() => {
          return this.$message.info('已取消')
        })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
