import { useEffect, useState, useRef } from 'react';
import './CustomCursor.css';
import cursorImg from '../assets/halloween-cursor.png';
import pointerImg from '../assets/halloween-pointer.png';

export function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const cursor = cursorRef.current;

        if (!cursor) return;

        const onMouseMove = (e: MouseEvent) => {
            if (!isVisible) setIsVisible(true);
            // Move the cursor
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        };

        const onMouseDown = () => {
            cursor.classList.add('cursor-clicked');
        };

        const onMouseUp = () => {
            cursor.classList.remove('cursor-clicked');
        };

        const onMouseLeave = () => {
            setIsVisible(false);
        };

        const onMouseEnter = () => {
            setIsVisible(true);
        };

        // Check for hoverable elements
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check explicit tags/roles first (faster)
            let isClickable =
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.getAttribute('role') === 'button' ||
                target.classList.contains('clickable') ||
                target.tagName === 'INPUT' ||
                target.tagName === 'SELECT' ||
                target.tagName === 'LABEL';

            // If not found yet, check computed style (slower but more accurate)
            if (!isClickable) {
                try {
                    const style = window.getComputedStyle(target);
                    isClickable = style.cursor === 'pointer';
                } catch (e) {
                    // Ignore errors
                }
            }

            setIsHovering(!!isClickable);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mouseleave', onMouseLeave);
        document.addEventListener('mouseenter', onMouseEnter);
        document.addEventListener('mouseover', handleMouseOver);

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mouseleave', onMouseLeave);
            document.removeEventListener('mouseenter', onMouseEnter);
            document.removeEventListener('mouseover', handleMouseOver);
        };
    }, [isVisible]);

    if (typeof window === 'undefined') return null;

    return (
        <div
            ref={cursorRef}
            className={`custom-cursor ${isHovering ? 'hovering' : ''} ${!isVisible ? 'hidden' : ''}`}
            style={{
                backgroundImage: `url(${isHovering ? pointerImg : cursorImg})`
            }}
        />
    );
}
