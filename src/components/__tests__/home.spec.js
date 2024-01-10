import { shallowMount } from '@vue/test-utils'
import HomeView from '../../views/HomeView.vue'
import HomeSongItem from '@/components/HomeSongItem.vue'

describe('HomeView.vue', () => {
  test('renders list of songs', () => {
    const songs = [{}, {}, {}]

    // use shallowMount and mock the $i18n property
    const component = shallowMount(HomeView, {
      data() {
        return { songs }
      },
      global: {
        mocks: {
          $t: (message) => message, // mock the $t function
          $i18n: {
            // mock the $i18n object
            locale: 'en'
          }
        }
      }
    })

    const items = component.findAllComponents(HomeSongItem)

    expect(items).toHaveLength(songs.length)

    items.forEach((wrapper, i) => {
      expect(wrapper.props().song).toStrictEqual(songs[i])
    })
  })
})
