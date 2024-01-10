import HomeSongItem from '@/components/HomeSongItem.vue'
import { RouterLinkStub, mount } from '@vue/test-utils'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    tm: () => ({
      footerLinks: [
        { title: 'Home', link: 'home' },
        { title: 'About', link: 'about' },
        { title: 'Contact', link: 'contact' }
      ]
    })
  })
}))

describe('HomeSongItem.vue', () => {
  test('renders song.display_name', async () => {
    const song = {
      display_name: 'test'
    }
    const wrapper = mount(HomeSongItem, {
      props: {
        song
      },
      global: {
        components: {
          'router-link': RouterLinkStub
        }
      }
    })

    const compositionAuthor = wrapper.find('.text-gray-500')
    expect(compositionAuthor.text()).toBe(song.display_name)
  })

  test('renders song.docId in the id attribute', async () => {
    const song = {
      docId: 'abc'
    }
    const wrapper = mount(HomeSongItem, {
      props: {
        song
      },
      global: {
        components: {
          'router-link': RouterLinkStub
        }
      }
    })

    expect(wrapper.attributes().id).toBe(`song-id-${song.docId}`)
  })
})
