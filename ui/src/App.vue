<template>
    <PageHeader />

    <main>
        <Wrapper class="gap-5">
            <SoundtrackMetadataForm
                @soundtrack-changed="onSoundtrackChanged"
                @soundtrack-loaded="onSoundtrackLoaded"
            />
            <SoundtrackMetadata
                :soundtrack="soundtrack"
                @soundtrack-add-to-queue="onSoundtrackAddToQueue"
            />
            <SoundtrackQueue />
        </Wrapper>
    </main>
</template>

<script setup>
import PageHeader from "@/components/PageHeader.vue";
import Wrapper from "@/components/Wrapper.vue";
import {ref} from "vue";
import SoundtrackMetadataForm from "@/components/SoundtrackMetadataForm.vue";
import SoundtrackMetadata from "@/components/SoundtrackMetadata.vue";
import SoundtrackQueue from "@/components/SoundtrackQueue.vue";

const soundtrack = ref(null);

function onSoundtrackChanged() {
    soundtrack.value = null;
}

function onSoundtrackLoaded(loadedSoundtrack) {
    soundtrack.value = loadedSoundtrack;
}

async function onSoundtrackAddToQueue(queueItem) {
    soundtrack.value = null;

    let response = await fetch('http://localhost:8080/api/queue/add', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(queueItem)
    });
    let json = response.json();

    console.log(json);
}
</script>

<style lang="scss" scoped>
main {
    @apply py-10;
}
</style>
