import { useEffect, useRef} from 'react';

export const useOneTimeAnimation = (threshold = 0.5) => {
    const elementRef = useRef<HTMLElement>(null);
    const hasAnimated = useRef(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated.current) {
                        entry.target.classList.add('sliding');
                        hasAnimated.current = true;
                        observer.unobserve(entry.target);
                    }
                });
            },
        { threshold: threshold });

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [threshold]);

    return elementRef
}