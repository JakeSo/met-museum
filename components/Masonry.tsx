/*
* Source: https://www.reactbits.dev/components/masonry
* Changes: improved accessibility
*/

'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'

export type MasonryItem = {
  id: string
  img: string
  url: string
  title: string
  height: number
}

type GridItem = MasonryItem & { x: number; y: number; w: number; h: number }

type Props = {
  items: MasonryItem[]
  ease?: string
  duration?: number
  stagger?: number
  animateFrom?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'random'
  scaleOnHover?: boolean
  hoverScale?: number
  blurToFocus?: boolean
  colorShiftOnHover?: boolean
}

const useMedia = (queries: string[], values: number[], defaultValue: number) => {
  const [value, setValue] = useState(defaultValue)
  useEffect(() => {
    const get = () => values[queries.findIndex(q => matchMedia(q).matches)] ?? defaultValue
    setValue(get())
    const handler = () => setValue(get())
    queries.forEach(q => matchMedia(q).addEventListener('change', handler))
    return () => queries.forEach(q => matchMedia(q).removeEventListener('change', handler))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return value
}

const useMeasure = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  useLayoutEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return [ref, size] as const
}

const preloadImages = (urls: string[]) =>
  Promise.all(
    urls.map(
      src =>
        new Promise<void>(resolve => {
          const img = new Image()
          img.src = src
          img.onload = img.onerror = () => resolve()
        })
    )
  )

export default function Masonry({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
}: Props) {
  const router = useRouter()
  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
    [5, 4, 3, 2],
    1
  )
  const [containerRef, { width }] = useMeasure()
  const [imagesReady, setImagesReady] = useState(false)
  const hasMounted = useRef(false)

  useEffect(() => {
    preloadImages(items.map(i => i.img)).then(() => setImagesReady(true))
  }, [items])

  const grid = useMemo<GridItem[]>(() => {
    if (!width) return []
    const colHeights = new Array<number>(columns).fill(0)
    const columnWidth = width / columns
    return items.map(child => {
      const col = colHeights.indexOf(Math.min(...colHeights))
      const x = columnWidth * col
      const h = child.height / 2
      const y = colHeights[col]
      colHeights[col] += h
      return { ...child, x, y, w: columnWidth, h }
    })
  }, [columns, items, width])

  const totalHeight = useMemo(
    () => (grid.length ? Math.max(...grid.map(item => item.y + item.h)) : 0),
    [grid]
  )

  const getInitialPosition = (item: GridItem) => {
    const containerRect = containerRef.current?.getBoundingClientRect()
    let direction: string = animateFrom
    if (animateFrom === 'random') {
      const dirs = ['top', 'bottom', 'left', 'right']
      direction = dirs[Math.floor(Math.random() * dirs.length)]
    }
    switch (direction) {
      case 'top': return { x: item.x, y: -200 }
      case 'bottom': return { x: item.x, y: window.innerHeight + 200 }
      case 'left': return { x: -200, y: item.y }
      case 'right': return { x: window.innerWidth + 200, y: item.y }
      case 'center': return {
        x: (containerRect?.width ?? 0) / 2 - item.w / 2,
        y: (containerRect?.height ?? 0) / 2 - item.h / 2,
      }
      default: return { x: item.x, y: item.y + 100 }
    }
  }

  useLayoutEffect(() => {
    if (!imagesReady) return
    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`
      const target = { x: item.x, y: item.y, width: item.w, height: item.h }
      if (!hasMounted.current) {
        const init = getInitialPosition(item)
        gsap.fromTo(selector, {
          opacity: 0, x: init.x, y: init.y, width: item.w, height: item.h,
          ...(blurToFocus && { filter: 'blur(10px)' }),
        }, {
          opacity: 1, ...target,
          ...(blurToFocus && { filter: 'blur(0px)' }),
          duration: 0.8, ease: 'power3.out', delay: index * stagger,
        })
      } else {
        gsap.to(selector, { ...target, duration, ease, overwrite: 'auto' })
      }
    })
    hasMounted.current = true
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, imagesReady])

  const handleMouseEnter = (item: GridItem) => {
    if (scaleOnHover) gsap.to(`[data-key="${item.id}"]`, { scale: hoverScale, duration: 0.3, ease: 'power2.out' })
    if (colorShiftOnHover) gsap.to(`[data-key="${item.id}"] .color-overlay`, { opacity: 0.3, duration: 0.3 })
  }

  const handleMouseLeave = (item: GridItem) => {
    if (scaleOnHover) gsap.to(`[data-key="${item.id}"]`, { scale: 1, duration: 0.3, ease: 'power2.out' })
    if (colorShiftOnHover) gsap.to(`[data-key="${item.id}"] .color-overlay`, { opacity: 0, duration: 0.3 })
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: totalHeight }}>
      {grid.map(item => (
        <button
          key={item.id}
          data-key={item.id}
          onClick={() => router.push(item.url)}
          onMouseEnter={() => handleMouseEnter(item)}
          onMouseLeave={() => handleMouseLeave(item)}
          aria-label={`View artwork ${item.id}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            padding: 6,
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            willChange: 'transform, width, height, opacity',
          }}
        >
          <div
            style={{
              backgroundImage: `url(${item.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '100%',
              borderRadius: 10,
              boxShadow: '0px 10px 50px -10px rgba(0,0,0,0.2)',
              position: 'relative',
            }}
          >
            {colorShiftOnHover && (
              <div
                className="color-overlay"
                style={{
                  position: 'absolute', inset: 0, opacity: 0, pointerEvents: 'none',
                  borderRadius: 10,
                  background: 'linear-gradient(45deg, rgba(255,0,150,0.5), rgba(0,150,255,0.5))',
                }}
              />
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
