const randomGradient = () => {
    const minAngleDifference = 30; // Minimum angle difference in degrees
    let startAngle = Math.random() * 360;
    let endAngle = startAngle + minAngleDifference + Math.random() * (360 - minAngleDifference);

    // Normalize the angles to be within 0 to 360 degrees
    startAngle = startAngle % 360;
    endAngle = endAngle % 360;

    const start = {
        x: Math.cos(startAngle * Math.PI / 180),
        y: Math.sin(startAngle * Math.PI / 180),
    };
    const end = {
        x: Math.cos(endAngle * Math.PI / 180),
        y: Math.sin(endAngle * Math.PI / 180),
    };
    return {
        start,
        end,
    };
};
export default randomGradient;
