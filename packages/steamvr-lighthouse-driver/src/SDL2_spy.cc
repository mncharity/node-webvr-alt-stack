#include <dlfcn.h>
#include <iostream>
#include <SDL2/SDL.h>

void *dl;

int SDL_Init (Uint32 flags) {
  dl = dlopen("/usr/lib/x86_64-linux-gnu/libSDL2.so",RTLD_LAZY);
  int ret = ((int (*)(Uint32)) dlsym(dl,"SDL_Init"))(flags);
  std::cerr << "SDL_Init " << flags << " returned " << ret << std::endl;
  return ret;
}
int SDL_GetNumVideoDisplays () {
  int ret = ((int (*)(void)) dlsym(dl,"SDL_GetNumVideoDisplays"))();
  std::cerr << "SDL_GetNumVideoDisplays " << " returned " << ret << std::endl;
  return ret;
}
const char* SDL_GetDisplayName (int displayIndex) {
  const char* ret = ((const char* (*)(int)) dlsym(dl,"SDL_GetDisplayName"))(displayIndex);
  std::cerr << "SDL_GetDisplayName " << displayIndex << " returned " << ">" << ret << "<" << std::endl;
  return ret;
}
int SDL_GetDisplayBounds (int displayIndex, SDL_Rect * rect) {
  int ret = ((int (*)(int,SDL_Rect*)) dlsym(dl,"SDL_GetDisplayBounds"))(displayIndex,rect);
  std::cerr << "SDL_GetDisplayBounds " << displayIndex << " returned " << "{x:" << rect->x << ",y:" << rect->y << ",w:" << rect->w << ",h:" << rect->h << "}" << std::endl;
  return ret;
}
int SDL_GetCurrentDisplayMode (int displayIndex, SDL_DisplayMode * mode) {
  int ret = ((int (*)(int,SDL_DisplayMode*)) dlsym(dl,"SDL_GetCurrentDisplayMode"))(displayIndex,mode);
  std::cerr << "SDL_GetCurrentDisplayMode " << displayIndex << " returned " << "{format:" << mode->format << ",w:" << mode->w << ",h:" << mode->h << ",refresh_rate:" << mode->refresh_rate << ",driverdata:" << mode->driverdata << "}" << std::endl;
  return ret;
}

