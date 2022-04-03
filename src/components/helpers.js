export const helpers = {
    createNode: (elementType, props = {}) => {
        const element = document.createElement(elementType);
        for(const prop in props) {
            if(prop) element[prop] = props[prop];
        }
        return element;
    },
    setStyle: (node, styles = {}) => {
        if(node) {
            for(const style in styles) {
                if(style) node.style[style] = styles[style];
            }
        }
    },
};