<template>
    <div class="radial-loader">
        <div class="progress"></div>
    </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.radial-loader {
    @apply w-8 h-8 rounded-full border-[6px] border-muted border-l-foreground animate-spin;
}
</style>