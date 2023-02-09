import { mount } from '@vue/test-utils'
import Navigation from '../Navigation.vue'

describe('Navigation', () => {
  it('should display header text', () => {
    const msg = 'Navigation'
    const wrapper = mount(Navigation, { props: { msg } })

    expect(wrapper.find('h1').text()).toEqual(msg)
  })
})
