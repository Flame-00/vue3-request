<script setup lang="ts">
import { VPTeamMembers } from "vitepress/theme";
import { withBase } from "vitepress";
import type { Props } from "./type";
const props = withDefaults(defineProps<Props>(), {
  size: "medium",
  members: () => [
    {
      avatar: withBase("/avatar.jpg"),
      name: "Flame-00",
      title: "Creator",
      links: [
        {
          icon: "github",
          link: "https://github.com/Flame-00/vue3-request",
        },
      ],
    },
  ],
});
</script>

<template>
  <VPTeamMembers :members="props.members" />
</template>
