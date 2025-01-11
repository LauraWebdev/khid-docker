<template>
    <Card>
        <CardContent class="p-6 flex gap-2">
            <Input
                v-model="urlOrSlug"
                placeholder="Enter URL or album ID"
                :disabled="isLoading"
            />
            <Button
                @click="loadAlbum"
                :disabled="isLoading"
            >
                <span>Load Album</span>
            </Button>
        </CardContent>
    </Card>
</template>

<script setup>
import {Card, CardContent} from "@/components/ui/card/index.js";
import {Button} from "@/components/ui/button/index.js";
import {Input} from "@/components/ui/input/index.js";
import getSoundtrackMeta from "@/lib/getSoundtrackMeta";
import {ref} from "vue";

const emit = defineEmits([
    'soundtrackChanged',
    'soundtrackLoaded'
]);

const urlOrSlug = ref("");
const isLoading = ref(false);

async function loadAlbum() {
    isLoading.value = true;
    emit('soundtrackChanged', urlOrSlug.value);

    let soundtrack = await getSoundtrackMeta(urlOrSlug.value);
    emit('soundtrackLoaded', soundtrack);
    isLoading.value = false;
}
</script>