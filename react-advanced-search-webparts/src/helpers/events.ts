export function on(element: HTMLElement, event: string, selectorOrHandler: string | Function, handler: Function) {
    element.addEventListener(event, (e) => {
        let target: HTMLElement = <HTMLElement>e.target;
        if (typeof(selectorOrHandler) === 'string') {
            while (!target.matches(selectorOrHandler) && target !== element) {
                target = target.parentElement;
            }

            if (target.matches(selectorOrHandler)) {
                handler.call(target, e);
            }
        } else {
            selectorOrHandler.call(element, e);
        }
    });
}