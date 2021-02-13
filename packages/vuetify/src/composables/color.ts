// Utilities
import { computed, isRef, ref, toRef } from 'vue'
import { isCssColor } from '@/util/colorUtils'

// Types
import type { Ref, CSSProperties, UnwrapRef, MaybeRef } from 'vue'

type ColorValue = string | null | undefined

interface ColorData {
  readonly colorClasses: Ref
  readonly colorStyles: Ref<null | CSSProperties>
}

export function useColor (color: Ref<ColorValue>, isBackground?: MaybeRef<boolean>): ColorData
export function useColor<T extends Record<K, ColorValue>, K extends string> (
  props: T,
  name: K,
  isBackground?: MaybeRef<boolean>,
): ColorData
export function useColor<T extends Record<K, ColorValue>, K extends string> (
  props: T | Ref<ColorValue>,
  name?: K | MaybeRef<boolean>,
  isBackground: MaybeRef<boolean> = false,
): ColorData {
  let background: Ref<boolean>
  let color: Ref<ColorValue> | null

  if (isRef(props)) {
    background = ref(name as MaybeRef<boolean>)
    color = props
  } else {
    background = ref(isBackground)
    color = name ? toRef(props, name as K) : null
  }

  const data = computed(() => {
    const data: UnwrapRef<Writable<ColorData>> = {
      colorClasses: null,
      colorStyles: null,
    }
    if (!color?.value) return data

    if (isCssColor(color.value)) {
      if (background.value) {
        data.colorStyles = {
          backgroundColor: color.value,
        }
      } else {
        data.colorStyles = {
          color: color.value,
          caretColor: color.value,
        }
      }
    } else {
      data.colorClasses = (background.value ? 'bg-' : 'text-') + color.value
    }

    return data
  })

  return {
    colorClasses: computed(() => data.value.colorClasses),
    colorStyles: computed(() => data.value.colorStyles),
  }
}
