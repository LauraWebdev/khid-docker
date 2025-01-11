<template>
    <section class="wrapper">
        <slot />
    </section>
</template>

<style lang="scss" scoped>
.wrapper {
    @apply max-w-screen-md mx-auto flex flex-col;
}
</style>