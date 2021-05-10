import { useRef, useState, useEffect, useCallback } from 'react';
import Tweezer from 'tweezer.js';

function useScrollSnap({ ref = null, duration = 100, delay = 50 }) {
    const isActiveInteractionRef = useRef(null);
    const scrollTimeoutRef = useRef(null);
    const currentScrollOffsetRef = useRef(null);
    const targetScrollOffsetRef = useRef(null);
    const animationRef = useRef(null);
    const [scrollIndex, setScrollIndex] = useState(0);

    const tickAnimation = useCallback((value) => {
        const scrollTopDelta = targetScrollOffsetRef.current - currentScrollOffsetRef.current;
        const scrollTop = currentScrollOffsetRef.current + (scrollTopDelta * value / 10000);
        window.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }, []);

    const resetAnimation = useCallback(() => {
        currentScrollOffsetRef.current = window.pageYOffset;
        targetScrollOffsetRef.current = 0;
        animationRef.current = null;
    }, []);

    const endAnimation = useCallback(() => {
        if (!animationRef.current) return;
        animationRef.current.stop();
        resetAnimation();
    }, [resetAnimation]);

    // Modified from https://stackoverflow.com/a/125106
    const getElementsInView = useCallback(() => {
        const elements = [].slice.call(ref.current.children); // Need to convert HTMLCollection to native JS Array
        return elements.filter((element) => {
            let top = element.offsetTop;
            const height = element.offsetHeight;
            while (element.offsetParent) {
                element = element.offsetParent;
                top += element.offsetTop;
            }
            return top < (window.pageYOffset + window.innerHeight) && (top + height) > window.pageYOffset;
        });
    }, [ref]);

    const getTargetScrollOffset = useCallback((element) => {
        let top = element.offsetTop;
        while (element.offsetParent) {
            element = element.offsetParent;
            top += element.offsetTop;
        }
        return top;
    }, []);

    const snapToTarget = useCallback((target) => {
        if (animationRef.current) {
            animationRef.current.stop();
        }

        const elements = [].slice.call(ref.current.children);
        elements.forEach((element, index) => {
            if (element.isSameNode(target)) {
                setScrollIndex(index);
            }
        });

        targetScrollOffsetRef.current = getTargetScrollOffset(target);
        animationRef.current = new Tweezer({
            start: 0,
            end: 10000,
            duration: duration,
        });

        animationRef.current.on('tick', tickAnimation);
        animationRef.current.on('done', resetAnimation);

        animationRef.current.begin();
    }, [ref, duration, getTargetScrollOffset, tickAnimation, resetAnimation]);

    const findSnapTarget = useCallback(() => {
        const deltaY = window.pageYOffset - currentScrollOffsetRef.current;
        currentScrollOffsetRef.current = window.pageYOffset;

        const elementsInView = getElementsInView();
        if (!elementsInView || elementsInView.length < 2) return;

        if (deltaY > 0) {
            snapToTarget(elementsInView[1]);
        } else {
            snapToTarget(elementsInView[0]);
        }
    }, [getElementsInView, snapToTarget]);

    const onInteractionStart = useCallback(() => {
        endAnimation();
        isActiveInteractionRef.current = true;
    }, [endAnimation]);

    const onInteractionEnd = useCallback(() => {
        isActiveInteractionRef.current = false;
        findSnapTarget();
    }, [findSnapTarget]);

    const onInteraction = useCallback(() => {
        endAnimation();
        if (scrollTimeoutRef) clearTimeout(scrollTimeoutRef.current);
        if (isActiveInteractionRef.current || animationRef.current) return;

        scrollTimeoutRef.current = setTimeout(findSnapTarget, 500);
    }, [endAnimation, findSnapTarget]);

    useEffect(() => {
        if (ref) {
            resetAnimation();

            document.addEventListener('keydown', onInteractionStart, { passive: true });
            document.addEventListener('keyup', onInteractionEnd, { passive: true });
            document.addEventListener('touchstart', onInteractionStart, { passive: true });
            document.addEventListener('touchend', onInteractionEnd, { passive: true });
            document.addEventListener('wheel', onInteraction, { passive: true });

            findSnapTarget();

            return () => {
                endAnimation();

                document.removeEventListener('keydown', onInteractionStart, { passive: true });
                document.removeEventListener('keyup', onInteractionEnd, { passive: true });
                document.removeEventListener('touchstart', onInteractionStart, { passive: true });
                document.removeEventListener('touchend', onInteractionEnd, { passive: true });
                document.removeEventListener('wheel', onInteraction, { passive: true });
            }
        }
    }, [
        ref,
        resetAnimation,
        findSnapTarget,
        endAnimation,
        onInteractionStart,
        onInteractionEnd,
        onInteraction
    ]);

    return scrollIndex;
}

export default useScrollSnap;
