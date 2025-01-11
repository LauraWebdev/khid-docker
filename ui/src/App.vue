<template>
    <PageHeader />

    <main>
        <Wrapper class="gap-5">
            <Card>
                <CardContent class="p-6 flex gap-2">
                    <Input v-model="urlOrSlug" placeholder="Enter URL or album ID" />
                    <Button @click="loadAlbum">
                        <span>Load Album</span>
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader class="text-lg font-bold">Queue</CardHeader>
                <CardContent>
                    Content Here
                </CardContent>
                <CardFooter class="flex gap-2 justify-end">
                    <Button variant="ghost">
                        <span>Clear Queue</span>
                    </Button>
                </CardFooter>
            </Card>
        </Wrapper>
    </main>
</template>

<script setup>
import PageHeader from "@/components/PageHeader.vue";
import Wrapper from "@/components/Wrapper.vue";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card/index.js";
import {Button} from "@/components/ui/button/index.js";
import {Input} from "@/components/ui/input/index.js";
import {ref} from "vue";

const urlOrSlug = ref("https://downloads.khinsider.com/game-soundtracks/album/portal");

function loadAlbum() {
    console.log(urlOrSlug.value);
}
</script>

<style lang="scss" scoped>
main {
    @apply py-10;
}
</style>
