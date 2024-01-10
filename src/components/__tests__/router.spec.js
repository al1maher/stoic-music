import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import HomeSongItem from '@/components/HomeSongItem.vue'

describe('router', () => {
  test('renders router link', () => {
    const song = {
      docId: 'abc'
    }

    const wrapper = shallowMount(HomeSongItem, {
      propsData: {
        song
      },
      global: {
        components: {
          'router-link': RouterLinkStub
        }
      }
    })

    expect(wrapper.findComponent(RouterLinkStub).props().to).toEqual(`/song/${song.docId}`)
  })
})
