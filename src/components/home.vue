<template>
    <div>
        <el-button type='info' @click="logout">退出</el-button>
    </div>
</template>
<script>
import router from '@/router/index.js'

export default {
  methods: {
    logout () {
      window.sessionStorage.clear()
      router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped>

</style>
