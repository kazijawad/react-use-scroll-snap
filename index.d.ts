declare function useScrollSnap(duration?: number, delay?: number): {
    scrollRef: HTMLElement | null;
    scrollIndex: number;
}

export = useScrollSnap;
