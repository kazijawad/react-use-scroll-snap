import { useRef, useState, useEffect } from 'react'
import Tweezer from 'tweezer.js'

enum Direction {
    Up,
    Down,
    None,
}

interface ScrollState {
    currentOffset: number;
    targetOffset: number;
    timeoutID: number;
    direction: Direction;
    directionStart: number;
    animation: Tweezer | null;
}

interface useScrollSnapProps {
    ref: React.RefObject<HTMLElement>;
    duration: number;
    delay: number;
}

function useScrollSnap({
    ref: elementRef,
    duration = 100,
    delay = 0,
}: useScrollSnapProps): number {
    const dataRef = useRef<ScrollState>({
        currentOffset: 0,
        targetOffset: 0,
        timeoutID: 0,
        direction: Direction.None,
        directionStart: 0,
        animation: null
    })

    const [currentIndex, setCurrentIndex] = useState(0)

    const getTargetScrollOffset = (element: HTMLElement) => {
        let top = element.offsetTop
        while (element.offsetParent) {
            element = element.offsetParent as HTMLElement
            top += element.offsetTop
        }
        return top
    }

    // Modified from https://stackoverflow.com/a/125106
    const getElementsInView = () => {
        const elements = Array.from(elementRef.current!.children) as Array<HTMLElement>

        return elements.filter((element) => {
            let top = element.offsetTop
            const height = element.offsetHeight
            while (element.offsetParent) {
                element = element.offsetParent as HTMLElement
                top += element.offsetTop
            }
            return top < (window.pageYOffset + window.innerHeight) && (top + height) > window.pageYOffset
        })
    }

    const findSnapTarget = () => {
        if (dataRef.current.direction === Direction.None) return

        const elementsInView = getElementsInView()
        if (elementsInView.length < 1) return

        dataRef.current.currentOffset = window.pageYOffset

        if (dataRef.current.direction === Direction.Up) {
            snapToTarget(elementsInView[0])
        } else if (dataRef.current.direction === Direction.Down) {
            snapToTarget(elementsInView[elementsInView.length - 1])
        }
    }

    const snapToTarget = (target: HTMLElement) => {
        if (dataRef.current.animation) {
            dataRef.current.animation.stop()
        }

        const elements = Array.from(elementRef.current!.children)
        for (let i = 0; i < elements.length; ++i) {
            const element = elements[i]
            if (element.isSameNode(target)) {
                setCurrentIndex(i)
            }
        }

        dataRef.current.targetOffset = getTargetScrollOffset(target)

        const animation = new Tweezer({
            start: 0,
            end: 10000,
            duration: duration,
        })

        animation.on('tick', tickAnimation)
        animation.on('done', clearAnimation)

        dataRef.current.animation = animation
        animation.begin()
    }

    const tickAnimation = (value: number) => {
        const scrollTopDelta = dataRef.current.targetOffset - dataRef.current.currentOffset
        const scrollTop = dataRef.current.currentOffset + (scrollTopDelta * value / 10000)
        window.scrollTo({ top: scrollTop, behavior: 'smooth' })
    }

    const clearAnimation = () => {
        clearTimeout(dataRef.current.timeoutID)

        if (dataRef.current.animation) {
            dataRef.current.animation.stop()
        }

        dataRef.current = {
            currentOffset: 0,
            targetOffset: 0,
            timeoutID: 0,
            direction: Direction.None,
            directionStart: 0,
            animation: null,
        }
    }

    const handleInteraction = () => {
        dataRef.current.timeoutID = setTimeout(findSnapTarget, delay)
    }

    const handleWheel = (event: WheelEvent) => {
        clearAnimation()

        if (event.deltaY < 0) {
            dataRef.current.direction = Direction.Up
        } else if (event.deltaY > 0) {
            dataRef.current.direction = Direction.Down
        } else {
            dataRef.current.direction = Direction.None
        }

        handleInteraction()
    }

    const handleTouchStart = (event: TouchEvent) => {
        dataRef.current.directionStart = event.touches[0].clientY
    }

    const handleTouchMove = (event: TouchEvent) => {
        const deltaY = event.touches[0].clientY - dataRef.current.directionStart

        if (deltaY < 0) {
            dataRef.current.direction = Direction.Up
        } else if (deltaY > 0) {
            dataRef.current.direction = Direction.Down
        } else {
            dataRef.current.direction = Direction.None
        }

        handleInteraction()
    }

    useEffect(() => {
        if (elementRef) {
            clearAnimation()

            document.addEventListener('wheel', handleWheel, { passive: true })
            document.addEventListener('touchstart', handleTouchStart, { passive: true })
            document.addEventListener('touchmove', handleTouchMove, { passive: true })

            findSnapTarget()

            return () => {
                clearAnimation()

                document.removeEventListener('wheel', handleWheel)
                document.removeEventListener('touchstart', handleTouchStart)
                document.removeEventListener('touchmove', handleTouchMove)
            }
        }
    }, [elementRef])

    return currentIndex
}

export default useScrollSnap
