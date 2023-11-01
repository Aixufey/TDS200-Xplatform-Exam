const randomGradient = () => {
    const angle = Math.random() * 360;
    const start = {
        x: Math.cos(angle),
        y: Math.sin(angle),
    };
    const end = {
        x: Math.cos(angle + Math.PI),
        y: Math.sin(angle + Math.PI),
    };
    return {
        start,
        end,
    };
};
export default randomGradient;
