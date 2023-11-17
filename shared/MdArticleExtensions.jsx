window.mdExtensions = {};

export const SharedExtensions = import.meta.glob('./md/*', { eager: true });
export const ContentExtensions = import.meta.glob('../content/js/md/*', { eager: true });