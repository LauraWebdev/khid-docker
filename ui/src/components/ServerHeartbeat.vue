<template>
    <TooltipProvider v-if="serverOnline === true">
        <Tooltip>
            <TooltipTrigger as-child>
                <Badge variant="success">online</Badge>
            </TooltipTrigger>
            <TooltipContent>
                <p>Up for {{ serverUptime }} seconds</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
    <Badge variant="destructive" v-if="serverOnline === false">offline</Badge>
</template>

<script setup>
import {Badge} from "@/components/ui/badge";
import {onMounted, ref} from "vue";
import {API_BASE_URL} from "../../env.js";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

const serverOnline = ref(null);
const serverUptime = ref(0);

onMounted(() => {
    checkHeartbeat();

    setInterval(() => checkHeartbeat(), 10000);
    setInterval(() => { if(serverOnline.value) serverUptime.value++; }, 1000);
});

async function checkHeartbeat() {
    try {
        let response = await fetch(API_BASE_URL + '/api/heartbeat/');
        let json = await response.json();

        serverOnline.value = json?.status === 200 || false;
        serverUptime.value = Math.floor(json?.uptime ?? 0);
    } catch(err) {
        console.error(err);
        serverOnline.value = false;
    }
}
</script>