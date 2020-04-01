<template>
  <div class="Builder">
    <Section v-for="section in sections" :key="section.id" :section="section" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Section from '../components/Section.vue'

export default Vue.extend({
  components: {
    Section
  },
  computed: {
    sections() {
      const { sectionIds } = this.$store.getters
      const sections = []
      sectionIds.forEach((id) => {
        sections.push(this.$store.getters.sectionById(id))
      })
      return sections
    }
  }
})
</script>

<style>
.Builder {
  @apply min-h-screen flex justify-center items-center p-20;
}
</style>
