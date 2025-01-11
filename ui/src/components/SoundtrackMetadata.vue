<template>
    <Card v-if="soundtrack">
        <CardHeader class="flex-row items-center gap-2">
            <div class="flex flex-col gap-1 grow">
                <span class="text-lg font-bold">{{ soundtrack.title }}</span>
                <div class="formats">
                    <Badge v-for="format in soundtrack.formats" :key="format" variant="secondary">{{ format }}</Badge>
                </div>
            </div>
            <Button
                @click="addToDownloadQueue"
            >
                <i class="ri-download-line"></i>
                <span>Download</span>
            </Button>
        </CardHeader>
        <CardContent class="content">
            <Card>
                <CardContent class="p-4 flex flex-col gap-2">
                    <div class="grid grid-cols-[1fr_3fr] gap-2 items-center">
                        <Label>Download Format</Label>
                        <Select v-model="selectedFormat">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    v-for="format in soundtrack.formats"
                                    :key="format"
                                    :value="format"
                                >
                                    {{ format }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="grid grid-cols-[auto_1fr_3fr] gap-2 items-center">
                        <Switch :checked="overrideArtistActive" @update:checked="(checked) => overrideArtistActive = checked" />
                        <Label>Override Artist</Label>
                        <Input v-model="overrideArtist" :disabled="!overrideArtistActive" />
                    </div>

                    <div class="grid grid-cols-[auto_1fr_3fr] gap-2 items-center">
                        <Switch :checked="overrideGenreActive" @update:checked="(checked) => overrideGenreActive = checked" />
                        <Label>Override Genre</Label>
                        <Input v-model="overrideGenre" :disabled="!overrideGenreActive" />
                    </div>

                    <div class="grid grid-cols-[auto_1fr_3fr] gap-2 items-center">
                        <Switch :checked="overrideAlbumActive" @update:checked="toggleOverrideAlbumActive" />
                        <Label>Override Album</Label>
                        <Input v-model="overrideAlbum" :disabled="!overrideAlbumActive" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent class="song-list">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead class="w-full pl-4">Title</TableHead>
                                <TableHead class="pr-4">Download</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow
                                v-for="(song, n) in soundtrack.songs"
                                :key="n"
                                @click="() => { toggleExclusion(song.url); }"
                            >
                                <TableCell :class="`pl-4 ${excludedTracks.includes(song.url) ? 'text-muted-foreground' : ''}`">{{ song.title }}</TableCell>
                                <TableCell class="flex justify-end pr-4">
                                    <Switch :checked="!excludedTracks.includes(song.url)" />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </CardContent>
    </Card>
</template>

<script setup>
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card/index.js";
import {Button} from "@/components/ui/button/index.js";
import {Badge} from "@/components/ui/badge/index.js";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table/index.js";
import {Switch} from "@/components/ui/switch/index.js";
import {ref} from "vue";
import {Label} from "@/components/ui/label/index.js";
import {Input} from "@/components/ui/input/index.js";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select/index.js";

const emit = defineEmits([
    'soundtrackAddToQueue'
]);

const excludedTracks = ref([]);

const selectedFormat = ref('mp3');
const overrideArtistActive = ref(false);
const overrideArtist = ref("");
const overrideGenreActive = ref(false);
const overrideGenre = ref("");
const overrideAlbumActive = ref(false);
const overrideAlbum = ref("");

const props = defineProps({
    soundtrack: {
        type: [Object, null],
        default: null
    },
});

function toggleExclusion(track) {
    if (excludedTracks.value.includes(track)) {
        excludedTracks.value = excludedTracks.value.filter((excludedTrack) => excludedTrack !== track);
    } else {
        excludedTracks.value.push(track);
    }
}

function toggleOverrideAlbumActive(checked) {
    overrideAlbumActive.value = checked;

    if(checked) {
        overrideAlbum.value = props.soundtrack.title;
    } else {
        overrideAlbum.value = "";
    }
}

function addToDownloadQueue() {
    let soundtrack = JSON.parse(JSON.stringify(props.soundtrack));
    soundtrack.songs = soundtrack.songs.filter((track) => !excludedTracks.value.includes(track.url));

    soundtrack.format = selectedFormat.value;
    soundtrack.overrides = {
        artist: overrideArtistActive.value ? overrideArtist.value : false,
        genre: overrideGenreActive.value ? overrideGenre.value : false,
        album: overrideAlbumActive.value ? overrideAlbum.value : false
    };

    emit('soundtrackAddToQueue', soundtrack);
}
</script>

<style lang="scss" scoped>
.formats {
    @apply flex gap-1 items-center;
}
.content {
    @apply flex flex-col gap-4;

    & .song-list {
        @apply p-0;

        & .song {
            @apply flex gap-2 border p-2 rounded;
        }
    }
}
</style>