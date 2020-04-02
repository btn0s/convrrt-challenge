<template>
  <div
    :class="{ Block: true, isDragging: isDragging, isResizing: isResizing }"
    :style="blockPlacement"
  >
    <div class="Content">
      {{ block.id }}
    </div>
    <div
      class="Ghost"
      :style="ghostDraggingStyle"
      @mouseup="(e) => handleMouseUp(e)"
      @mousemove="(e) => handleMouseMove(e)"
    >
      <div class="Icon DragIcon" @mousedown="(e) => handleDragStart(e)">
        DRAG
      </div>
      <div class="Icon ResizeIcon" @mousedown="(e) => handleResizeStart(e)">
        RESIZE
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  props: { block: { type: Object, required: true } },
  data() {
    return {
      isDragging: false,
      isResizing: false,
      resizeData: {},
      dragStartCoords: { x: 0, y: 0 },
      ghostDraggingStyle: {},
      blockData: {}
    }
  },
  computed: {
    blockPlacement() {
      const { x, y, h, w } = this.blockData

      const colStart = x === 0 ? 1 : x
      const rowStart = y === 0 ? 1 : y

      return {
        gridColumnStart: colStart,
        gridColumnEnd: colStart + w,
        gridRowStart: rowStart,
        gridRowEnd: rowStart + h
      }
    }
  },
  mounted() {
    this.blockData = { ...this.block }
  },
  methods: {
    ...mapMutations({
      update: 'UPDATE_BLOCK'
    }),
    handleMouseMove(e) {
      if (this.isDragging) {
        this.handleDrag(e)
      } else if (this.isResizing) {
        this.handleResize(e)
      }
    },
    handleMouseUp(e) {
      if (this.isDragging) {
        this.handleDragEnd(e)
      } else if (this.isResizing) {
        this.handleResizeEnd(e)
      }
    },
    handleDragStart(e) {
      const { clientX, clientY, offsetX, offsetY } = e
      const boxNode = e.target.parentNode.parentNode.getBoundingClientRect()
      const { height, width } = boxNode

      this.ghostDraggingStyle = {
        height: `${height}px`,
        width: `${width}px`,
        top: `${clientY}px`,
        left: `${clientX}px`,
        transform: `translate(${-Math.abs(offsetX)}px,${-Math.abs(offsetY)}px)`
      }

      this.isDragging = true
    },
    handleDrag(e) {
      const { clientX, clientY } = e
      const boxNode = e.target.parentNode.parentNode.getBoundingClientRect()
      const { x, y } = boxNode

      this.ghostDraggingStyle = {
        ...this.ghostDraggingStyle,
        top: `${clientY}px`,
        left: `${clientX}px`
      }

      const movementX = clientX - x
      const movementY = clientY - y

      if (movementX > 70) {
        if (this.blockData.x < 11) {
          this.blockData.x += 1
        }
      } else if (movementX < -70) {
        if (this.blockData.x > 0) {
          this.blockData.x -= 1
        }
      }

      if (movementY > 50) {
        if (this.blockData.y < 2) {
          this.blockData.y += 1
        }
      } else if (movementY < -50) {
        if (this.blockData.y > 0) {
          this.blockData.y -= 1
        }
      }
    },
    handleDragEnd() {
      this.isDragging = false
      this.ghostDraggingStyle = {}
      this.update({
        id: this.blockData.id,
        data: { ...this.blockData }
      })
    },
    handleResizeStart(e) {
      const { clientX, clientY } = e
      const {
        offsetHeight,
        offsetWidth,
        offsetTop,
        offsetLeft
      } = e.target.offsetParent.parentElement

      this.ghostDraggingStyle = {
        height: `${offsetHeight}px`,
        width: `${offsetWidth}px`,
        top: `${offsetTop}px`,
        left: `${offsetLeft}px`
      }

      this.resizeData.h = offsetHeight
      this.resizeData.w = offsetWidth
      this.resizeData.x = clientX
      this.resizeData.y = clientY
      this.dragStartCoords.x = clientX
      this.dragStartCoords.y = clientY
      this.isResizing = true
    },
    handleResize(e) {
      e.preventDefault()
      const { clientX, clientY } = e

      const growthX = clientX - this.resizeData.x
      const growthY = clientY - this.resizeData.y

      const ghostH = this.resizeData.h + growthY
      const ghostW = this.resizeData.w + growthX

      this.ghostDraggingStyle = {
        ...this.ghostDraggingStyle,
        height: `${ghostH}px`,
        width: `${ghostW}px`
      }

      if (growthX > 50) {
        this.resizeData.x = clientX
        this.resizeData.w += growthX

        if (this.blockData.w < 12 - this.blockData.x) {
          this.blockData.w += 1
        }
      } else if (growthX < -50) {
        this.resizeData.x = clientX
        this.resizeData.w += growthX

        if (this.blockData.w > 0) {
          this.blockData.w -= 1
        }
      }

      if (growthY > 20) {
        this.resizeData.y = clientY
        this.resizeData.h += growthY

        if (this.blockData.y < 2) {
          this.blockData.h += 1
        }
      } else if (growthY < -20) {
        this.resizeData.y = clientY
        this.resizeData.h += growthY

        if (this.blockData.y > 0) {
          this.blockData.h -= 1
        }
      }
    },
    handleResizeEnd(e) {
      e.preventDefault()
      this.ghostDraggingStyle = {}
      this.resizeData = {}
      this.isResizing = false
      this.update({
        id: this.blockData.id,
        data: { ...this.blockData }
      })
    }
  }
}
</script>

<style>
.Block {
  @apply relative;
  user-select: none;
}

.Block.isDragging .Content,
.Block.isResizing .Content {
  @apply opacity-75 bg-gray-300 text-gray-500;
}

.Content {
  @apply h-full border border-gray-400 p-2 rounded-md relative flex justify-center items-center;
}

.Ghost {
  @apply bg-white border border-red-700 border-dashed absolute top-0 left-0 right-0 bottom-0 rounded-md opacity-0;
  transition: opacity 200ms ease;
}

.Block:hover .Ghost {
  @apply opacity-75;
}

.Block.isDragging .Ghost,
.Block.isResizing .Ghost {
  @apply opacity-75 fixed z-50;
}

.Icon {
  @apply bg-white text-black py-1 px-2 rounded absolute text-sm;
}

.DragIcon {
  @apply cursor-move;
  top: 10px;
  left: 10px;
}

.ResizeIcon {
  cursor: nwse-resize;
  right: 10px;
  bottom: 10px;
}
</style>
