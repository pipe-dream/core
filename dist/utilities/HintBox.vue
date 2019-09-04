<template>
    <div class="mx-auto my-4 p-4 bg-white text-blue-600 text-xs border rounded border-blue-600 shadow">
        {{ message }}
    </div>
</template>

<script>
export default {
    props: ['message']
}
</script>