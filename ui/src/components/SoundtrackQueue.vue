<template>
    <Card>
        <CardHeader class="flex-row items-center gap-2">
            <div class="flex flex-col gap-1 grow items-start">
                <span class="text-lg font-bold">Download Queue</span>
                <div class="flex items-center gap-1">
                    <Badge variant="secondary"><span>{{ countTotal }}</span> <i class="ri-music-2-fill"></i></Badge>
                    <Badge variant="secondary"><span>{{ countQueued }}</span> <i class="ri-time-fill"></i></Badge>
                    <Badge variant="secondary"><span>{{ countDownloading }}</span> <i class="ri-download-line"></i></Badge>
                    <Badge variant="success"><span>{{ countDone }}</span> <i class="ri-check-line"></i></Badge>
                    <Badge variant="destructive"><span>{{ countFailed }}</span> <i class="ri-close-line"></i></Badge>
                </div>
            </div>
            <Button variant="secondary" @click="retryFailed">
                <i class="ri-refresh-line"></i>
                <span>Retry Failed</span>
            </Button>
            <Button variant="secondary" @click="clearDone">
                <i class="ri-delete-bin-5-line"></i>
                <span>Clear Done</span>
            </Button>
        </CardHeader>
        <CardContent class="p-0 border-t">
            <div class="empty-queue" v-if="countTotal === 0">
                <i class="ri-check-line"></i>
                <h1>Nothing to do</h1>
                <p>The download queue is empty.<br />Add a soundtrack to begin.</p>
            </div>
            <template v-else>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="pl-6">Title</TableHead>
                            <TableHead>Album</TableHead>
                            <TableHead>State</TableHead>
                            <TableHead class="w-[120px] pr-6">Progress</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow
                            v-for="queueItem in queue"
                            :key="queueItem.url"
                        >
                            <TableCell class="pl-6">{{ queueItem.title }}</TableCell>
                            <TableCell class="line-clamp-1">{{ queueItem.overrideAlbum || queueItem.album }}</TableCell>
                            <TableCell>
                                <div class="flex">
                                    <Badge :variant="getStateVariant(queueItem.state)">{{ queueItem.state }}</Badge>
                                </div>
                            </TableCell>
                            <TableCell class="pr-6">
                                <Progress :model-value="queueItem.progress" :max="100" />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </template>
        </CardContent>
    </Card>
</template>

<script setup>
import {Card, CardContent, CardHeader} from "@/components/ui/card/index.js";
import {Button} from "@/components/ui/button/index.js";
import {Badge} from "@/components/ui/badge/index.js";
import {onMounted, ref} from "vue";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table/index.js";
import {Progress} from "@/components/ui/progress/index.js";

const countTotal = ref(0);
const countQueued = ref(0);
const countDownloading = ref(0);
const countDone = ref(0);
const countFailed = ref(0);
const queue = ref([]);

onMounted(() => {
    checkQueue();

    setInterval(() => {
        checkQueue();
    }, 750);
});

async function clearDone() {
    let response = await fetch('/api/queue/clearDone');
    let json = await response.json();

    checkQueue();
}

async function retryFailed() {
    let response = await fetch('/api/queue/retryFailed');
    let json = await response.json();

    checkQueue();
}

async function checkQueue() {
    let response = await fetch('/api/queue');
    let json = await response.json();
    let data = json.data;

    queue.value = data.queue;
    countTotal.value = data.stats?.total ?? 0;
    countQueued.value = data.stats?.queued ?? 0;
    countDownloading.value = data.stats?.downloading ?? 0;
    countDone.value = data.stats?.done ?? 0;
    countFailed.value = data.stats?.failed ?? 0;
}

function getStateVariant(state) {
    switch (state) {
        default:
        case "queued":
            return "outline";
        case "downloading":
            return "secondary";
        case "done":
            return "success";
        case "failed":
            return "destructive";
    }
}
</script>

<style lang="scss" scoped>
.empty-queue {
    @apply flex flex-col items-center p-6 py-10;

    & i {
        @apply text-5xl mb-2 text-success;
    }
    & h1 {
        @apply font-bold text-lg;
    }
    & p {
        @apply text-muted-foreground text-center;
    }
}
</style>