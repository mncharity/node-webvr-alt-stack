#include <iostream>
#include <SDL2/SDL.h>

int SDL_Init (Uint32 flags) {
  std::cerr << "SDL_Init " << flags << std::endl;
  return 0;
}
int SDL_GetNumVideoDisplays () {
  std::cerr << "SDL_GetNumVideoDisplays " << std::endl;
  return 2;
}
const char* SDL_GetDisplayName (int displayIndex) {
  std::cerr << "SDL_GetDisplayName " << displayIndex << std::endl;
  switch (displayIndex) {
  case 0: return "Fake";
  case 1: return "HTC-VIVE 5\"";
  default: return "Bug in sdl_stub.cc";
  }
}
int SDL_GetDisplayBounds (int displayIndex, SDL_Rect * rect) {
  std::cerr << "SDL_GetDisplayBounds " << displayIndex << std::endl;
  int w0 = 1024;
  switch (displayIndex) {
  case 0:
    rect->x = 0; rect->y = 0; rect->w = w0; rect->h = 780;
    return 0;
  case 1:
    rect->x = w0; rect->y = 0; rect->w = 2160; rect->h = 1200;
    return 0;
  }
  return -1;
}
int SDL_GetCurrentDisplayMode (int displayIndex, SDL_DisplayMode * mode) {
  std::cerr << "SDL_GetCurrentDisplayMode " << displayIndex << std::endl;
  switch (displayIndex) {
  case 0:
    mode->format = 370546692; mode->w = 1024; mode->h = 780; mode->refresh_rate = 59;
    return 0;
  case 1:
    mode->format = 370546692; mode->w = 2160; mode->h = 1200; mode->refresh_rate = 89;
    return 0;
  }
  return -1;
}
