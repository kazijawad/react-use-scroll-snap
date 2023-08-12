import { useRef, useState, useEffect } from 'react'
import Tweezer from 'tweezer.js'

interface ScrollState {
    currentOffset: number;
    targetOffset: number;
    timeoutID: number;
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
        const deltaY = window.pageYOffset - dataRef.current.currentOffset
        dataRef.current.currentOffset = window.pageYOffset

        const elementsInView = getElementsInView()
        if (!elementsInView || elementsInView.length < 2) {
            return
        }

        if (deltaY > 0) {
            snapToTarget(elementsInView[1])
        } else {
            snapToTarget(elementsInView[0])
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
            animation: null,
        }
    }

    const handleInteraction = () => {
        clearAnimation()

        dataRef.current.timeoutID = setTimeout(findSnapTarget, delay)
    }

    useEffect(() => {
        if (elementRef) {
            clearAnimation()

            document.addEventListener('wheel', handleInteraction, { passive: true })
            document.addEventListener('touchmove', handleInteraction, { passive: true })

            findSnapTarget()

            return () => {
                clearAnimation()

                document.removeEventListener('wheel', handleInteraction)
                document.removeEventListener('touchmove', handleInteraction)
            }
        }
    }, [elementRef])

    return currentIndex
}

export default useScrollSnap
