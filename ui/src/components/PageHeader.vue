<template>
    <header>
        <Wrapper>
            <div class="brand">
                <span>KHID</span>
                <Badge variant="secondary">WebUI</Badge>
            </div>

            <nav>
                <ThemeSwitcher />
                <Button as-child variant="ghost" size="icon">
                    <a href="https://github.com/LauraWebdev/khid-docker">
                        <i class="ri-github-line"></i>
                    </a>
                </Button>
            </nav>
        </Wrapper>
    </header>
</template>

<script setup>
import Wrapper from "@/components/Wrapper.vue";
import {Button} from "@/components/ui/button";
import ThemeSwitcher from "@/components/ThemeSwitcher.vue";
import {Badge} from "@/components/ui/badge/index.js";
</script>

<style lang="scss" scoped>
header {
    @apply border-b py-4;

    & .wrapper {
        @apply flex-row gap-4 items-center;

        & .brand {
            @apply font-bold text-xl grow flex items-center gap-2;
        }

        & nav {
            @apply flex gap-1;
        }
    }
}
</style>