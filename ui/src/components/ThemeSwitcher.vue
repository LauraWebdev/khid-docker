<template>
    <Button
        variant="ghost"
        size="icon"
        @click="toggleTheme"
    >
        <i class="ri-sun-line" v-if="theme === 'dark'"></i>
        <i class="ri-moon-line" v-else></i>
    </Button>
</template>

<script setup>
import {Button} from "@/components/ui/button";
import {onMounted, ref} from "vue";

const theme = ref(localStorage.getItem('theme') || 'light');

onMounted(() => {
    setTheme();
});

function toggleTheme() {
    document.body.style.transition = "0.2s ease-in-out background";
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    setTheme();
}

function setTheme() {
    if(theme.value === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme.value);
}
</script>