<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单 -->
            <el-form ref="loginFromRef" :model="loginFrom" :rules="rules" label-width="0px" class="login_form">
                <!-- 用户名 -->
                <el-form-item prop="username">
                <el-input v-model="loginFrom.username"  prefix-icon="Avatar" placeholder="请输入账号" type="text"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                <el-input v-model="loginFrom.password"  prefix-icon="Lock" placeholder="请输入密码" type="password"></el-input>
                </el-form-item>
                <!-- 按钮区 -->
                <el-form-item class="btn_s" >
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginFrom">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import router from '@/router/index.js'
export default {
  data () {
    return {
      loginFrom: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 8,
            message: '用户名长度3-8',
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
            min: 3,
            max: 8,
            message: '密码长度3-8',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    resetLoginFrom () {
    //   console.log(this)
      this.$refs.loginFromRef.resetFields()
    },
    login () {
      this.$refs.loginFromRef.validate(async (valid) => {
        if (!valid) return
        const { data: result } = await this.$axios.post('http://127.0.0.1:8888/api/private/v1/login', this.loginFrom)
        console.log(result)
        if (result.meta.status !== 200) return ElMessage.error('登录失败')
        ElMessage.success('登录成功')
        window.sessionStorage.setItem('token', result.data.token)
        router.push('home')
      })
    }
  }
}
</script>

<style  lang="less" scope>
    .login_container{
        background-color: #2b4b6b;
        height: 100%;
    }
    .login_box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 2px;
        position: absolute;
        left: 50%;
        top:50%;
        transform: translate(-50%,-50%);
    }
    .avatar_box{
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius:50% ;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #fff;
        img{
            background-color: #eee;
            width: 100%;
            height: 100%;
            border-radius:50% ;
        }
    }
    .btn_s{
       float:right;
    }
    .login_form{
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
</style>
