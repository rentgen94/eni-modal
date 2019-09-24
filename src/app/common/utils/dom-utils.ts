export function isLeftButton(event: MouseEvent | TouchEvent) {
  return event.type === 'mousedown' && (event as MouseEvent).button === 0;
}

export function getEvent(event: MouseEvent | TouchEvent): MouseEvent | Touch {
  if (event.type === 'touchend' || event.type === 'touchcancel') {
    return (event as TouchEvent).changedTouches[0];
  }
  return event.type.startsWith('touch') ? (event as TouchEvent).targetTouches[0] : (event as MouseEvent);
}

export function maxZIndex(selectors: string = 'body *') {
  return (
    Array.from(document.querySelectorAll(selectors))
      .map(a => parseFloat(window.getComputedStyle(a).zIndex))
      .filter(a => !isNaN(a))
      .sort((a, b) => a - b)
      .pop() || 0
  );
}

export function decreaseZIndex(selectors: string = 'body *', minNumber: number = 1000) {
  const elements = Array.from(document.querySelectorAll(selectors));
  return elements
    .map(a => parseFloat(window.getComputedStyle(a).zIndex))
    .map((a, index) => {
      if (!isNaN(a)) {
        const newZIndex = a - 1;
        (elements[index] as HTMLElement).style.zIndex = (newZIndex < minNumber ? minNumber : newZIndex).toString();
      }
    });
}

export function findAncestor(el, selectors) {
  if (typeof el.closest === 'function') {
    return el.closest(selectors) || null;
  }
  while (el) {
    if (el.matches(selectors)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}
