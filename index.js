import { useRef, useState, useEffect } from 'react';

function useScrollSnap() {
    const containerRef = useRef(null);
    const scrollRef = useRef(null);
    const [scrollIndex, setScrollIndex] = useState(0);

    useEffect(() => {
        if (containerRef && scrollRef) {
            let scrollTimer = -1;

            const slides = scrollRef.current.children;
            let currentSlide = 0;
            setScrollIndex(currentSlide);

            const bottomReached = (elem) => {
                const rect = elem.getBoundingClientRect();
                return rect.bottom <= window.innerHeight;
            }

            const topReached = (elem) => {
                const rect = elem.getBoundingClientRect();
                return rect.top >= 0;
            };

            const isScrolledIntoView = (elem) => {
                const rect = elem.getBoundingClientRect();
                const elemTop = rect.top;
                const elemBottom = rect.bottom;
            
                // Only completely visible elements return true:
                // const isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
                // Partially visible elements return true:
                const isVisible = elemTop < window.innerHeight && elemBottom >= 0;
                return isVisible;
            };

            const eventListener = (event) => {
                if (scrollTimer != -1) clearTimeout(scrollTimer);
                scrollTimer = window.setTimeout(() => {
                    if (event.deltaY > 0) {
                        if ((currentSlide + 1 >= slides.length) ||
                            !bottomReached(slides[currentSlide]) ||
                            !isScrolledIntoView(containerRef.current)) return;
                        currentSlide++;
                    } else {
                        if ((currentSlide - 1 < 0) || !topReached(slides[currentSlide])) return;
                        currentSlide--;
                    }
        
                    event.preventDefault();
                    const slide = slides[currentSlide];
                    const slideOffset = window.pageYOffset + slide.getBoundingClientRect().top;
                    window.scrollTo({
                        top: slideOffset,
                        behavior: 'smooth',
                    });
                    setScrollIndex(currentSlide);
                }, 200);
            };

            document.addEventListener('wheel', eventListener);
            return () => {
                document.removeEventListener('wheel', eventListener);
            };
        }
    }, [containerRef, scrollRef]);

    return { containerRef, scrollRef, scrollIndex };
}

export default useScrollSnap;
