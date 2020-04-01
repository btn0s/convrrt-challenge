<template>
  <div class="Section">
    <div
      v-for="(cell, index) in numberOfCells"
      :key="index + 123"
      class="grid-cell"
      :style="calcCellPosition(index)"
    ></div>
    <Block v-for="block in blocks" :key="block.id" :block="block" />
  </div>
</template>

<script lang="ts">
import Block from './Block.vue'

export default {
  components: {
    Block
  },
  props: { section: { type: Object, required: true } },
  data() {
    return {
      gridData: {
        rows: 3,
        columns: 12
      }
    }
  },
  computed: {
    blocks() {
      const { blockIds } = this.section
      const blocks: object[] = []
      blockIds.forEach((id: string) => {
        blocks.push(this.$store.getters.blockById(id))
      })
      return blocks
    },
    numberOfCells(): number {
      return this.gridData.columns * this.gridData.rows
    }
  },
  methods: {
    calcCellPosition(index: number): object {
      let col
      let row

      if (index < 12) {
        col = index + 1
        row = 1
      } else if (index < 24) {
        col = index + 1 - 12
        row = 2
      } else {
        col = index + 1 - 24
        row = 3
      }

      return {
        gridColumnStart: col,
        gridColumnEnd: col,
        gridRowStart: row,
        gridRowEnd: row
      }
    }
  }
}
</script>

<style>
.Section {
  @apply w-full grid col-gap-3 h-40 grid-cols-12 grid-rows-3 gap-3;
}

.grid-cell {
  @apply bg-gray-100 rounded flex justify-center items-center text-gray-400;
}
</style>
