
function findViveDisplay (screen) {
  var viveDisplay = screen.getAllDisplays().find((display)=>{
    if (display.size.width == 2160 && display.size.height == 1200)
      return display;
    return false;
  });
  if (! viveDisplay) return undefined;
  return {
    x: viveDisplay.bounds.x + 30,
    y: viveDisplay.bounds.y + 30,
    fullscreen: true,
  };
};

module.exports = findViveDisplay;
