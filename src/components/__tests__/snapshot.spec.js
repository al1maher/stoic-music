import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import HomeSongItem from '@/components/HomeSongItem.vue'

describe('Snapshots HomeSongItem.vue', () => {
  test('renders correctly', () => {
    const song = {
      docId: 'abc',
      display_name: 'test',
      modified_name: 'test',
      comments_count: 0
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

    expect(wrapper.element).toMatchSnapshot()
  })
})
