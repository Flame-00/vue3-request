<template>
    <div class="container">
        <NForm :model="form" :rules="rules" ref="formRef">
            <NFormItem label="Username">
                <NInput v-model:value="form.username" />
            </NFormItem>
            <NFormItem label="Password">
                <NInput v-model:value="form.password" />
            </NFormItem>
            <NFormItem>
                <NButton @click="handleSubmit">Submit</NButton>
            </NFormItem>
        </NForm>
    </div>
</template>

<script setup lang="ts">
import { NForm, NFormItem, NInput, NButton, type FormInst } from 'naive-ui'
import { ref, useTemplateRef } from 'vue'

const formRef = useTemplateRef<FormInst>('formRef')
const form = ref({
    username: '',
    password: '',
})


const rules = {
    username: [
        { required: true, message: 'Please input username' },
        { min: 3, max: 5, message: 'Username must be between 3 and 5 characters' },
    ],
    password: [
        { required: true, message: 'Please input password' },
        { min: 3, max: 5, message: 'Password must be between 3 and 5 characters' },
    ],
}

const handleSubmit = async () => {
    const errors = await formRef.value?.validate()
    if (!errors) {
        console.log(form.value)
    } else {
        console.log(errors)
    }
}

</script>

<style scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>