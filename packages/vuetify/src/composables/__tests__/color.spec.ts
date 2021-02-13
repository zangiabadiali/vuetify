// Composables
import { useColor } from '../color'

// Utilities
import { reactive, toRef } from 'vue'

describe('useColor', () => {
  describe('text', () => {
    it('should return correct data', () => {
      const props = reactive({
        color: null as string | null,
      })
      const data = useColor(props, 'color')
      expect(data.colorClasses.value).toBeNull()
      expect(data.colorStyles.value).toBeNull()

      props.color = 'primary'
      expect(data.colorClasses.value).toEqual('text-primary')
      expect(data.colorStyles.value).toBeNull()

      props.color = ''
      expect(data.colorClasses.value).toBeNull()
      expect(data.colorStyles.value).toBeNull()

      props.color = '#ff00ff'
      expect(data.colorClasses.value).toBeNull()
      expect(data.colorStyles.value).toEqual({
        caretColor: '#ff00ff',
        color: '#ff00ff',
      })
    })

    it('should allow ref argument', () => {
      const props = reactive({
        color: 'primary',
      })
      const data = useColor(toRef(props, 'color'))

      expect(data.colorClasses.value).toEqual('text-primary')
      expect(data.colorStyles.value).toBeNull()
    })
  })

  describe('background', () => {
    it('should return correct data', () => {
      const props = reactive({
        bg: null as string | null,
      })
      const data = useColor(props, 'bg', true)
      expect(data.colorClasses.value).toBeNull()
      expect(data.colorStyles.value).toBeNull()

      props.bg = 'primary'
      expect(data.colorClasses.value).toEqual('bg-primary')
      expect(data.colorStyles.value).toBeNull()

      props.bg = ''
      expect(data.colorClasses.value).toBeNull()
      expect(data.colorStyles.value).toBeNull()

      props.bg = '#ff00ff'
      expect(data.colorClasses.value).toBeNull()
      expect(data.colorStyles.value).toEqual({
        backgroundColor: '#ff00ff',
      })
    })

    it('should allow ref argument', () => {
      const props = reactive({
        color: 'primary',
      })
      const data = useColor(toRef(props, 'color'), true)

      expect(data.colorClasses.value).toEqual('bg-primary')
      expect(data.colorStyles.value).toBeNull()
    })
  })
})
