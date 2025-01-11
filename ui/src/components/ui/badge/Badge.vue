<script setup>
import { cn } from '@/lib/utils';
import { badgeVariants } from '.';

const props = defineProps({
  variant: { type: null, required: false },
  class: { type: null, required: false },
});
</script>

<template>
  <div :class="cn(badgeVariants({ variant }), props.class, 'badge flex items-center gap-1')">
    <slot />
  </div>
</template>