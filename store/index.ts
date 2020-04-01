import { GetterTree, ActionTree, MutationTree } from 'vuex'

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
  sectionById: (state) => (id: string) => {
    return state.sections[id]
  },
  blockById: (state) => (id: string) => {
    return state.blocks[id]
  }
}

export const mutations: MutationTree<RootState> = {
  UPDATE_BLOCK: (state) => (payload: { id: string; data: object }) => {
    const { id, data } = payload
    state.blocks[id] = { ...state.blocks[id], data }
  }
}

export const actions: ActionTree<RootState, RootState> = {}
