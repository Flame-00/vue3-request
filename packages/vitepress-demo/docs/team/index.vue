<script setup lang="ts">
import { VPTeamMembers } from "vitepress/theme";
import { withBase } from "vitepress";
import type { Props } from "./type";
const props = withDefaults(defineProps<Props>(), {
  size: "medium",
  members: () => [
    {
      avatar: withBase("/avatar.jpg"),
      name: "badwoman0826",
      title: "Creator",
      links: [
        {
          icon: "github",
          link: "https://github.com/badwoman0826/vue3-request",
        },
      ],
    },
  ],
});
</script>

<template>
  <VPTeamMembers :members="props.members" />
</template>
