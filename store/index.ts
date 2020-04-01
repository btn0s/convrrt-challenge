import { GetterTree, ActionTree, MutationTree } from 'vuex'

const DEFAULT_BLOCK = {
  x: 0,
  y: 0,
  h: 2,
  w: 2
}

export const state = () => ({
  sections: {
    s1: {
      id: 's1',
      blockIds: ['b1', 'b2']
    }
  },
  blocks: {
    b1: {
      id: 'b1',
      x: 0,
      y: 0,
      h: 2,
      w: 2
    },
    b2: {
      id: 'b2',
      x: 4,
      y: 2,
      h: 2,
      w: 2
    }
  },
  builder: {
    sectionIds: ['s1']
  }
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  sectionIds: (state) => state.builder.sectionIds,
  sectionById: (state) => (id) => {
    return state.sections[id]
  },
  blockById: (state) => (id) => {
    return state.blocks[id]
  }
}

export const mutations: MutationTree<RootState> = {
  UPDATE_BLOCK: (state) => (payload: object) => {
    const { id, data } = payload
    Vue.set(state.blocks, id, { ...state.blocks[id], data })
  }
}

export const actions: ActionTree<RootState, RootState> = {}
