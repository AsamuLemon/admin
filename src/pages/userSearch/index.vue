<template>
    <div>{{ title }}</div>
    <el-button @click="ceshi">button</el-button>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
export default defineComponent({
    setup() {
        const route = useRoute()
        const router = useRouter()
        const data = reactive({
            title: '用户查询',
            ceshi() {
                console.log(route)
                console.log(router)
            }
        })
        return { ...toRefs(data) }
    }
})
</script>