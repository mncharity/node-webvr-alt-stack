{
  'targets': [
    {
      'target_name': 'addon',
      'sources': [
        'src/addon/addon.cc',
        'src/addon/get_device_properties.cc',
        'src/addon/pose.cc',
        'src/addon/ServerDriverHost.cc',
        'src/addon/VRSettings.cc',
      ],
      'include_dirs': [
        '<!(node -e "require(\'nan\')")',
        './files'
      ],
      'conditions': [
        ['OS=="linux"', {
          'cflags': [
            '-std=c++11',
          ],
          'ldflags': [
            # addon.cc dlopen()s driver_lighthouse
            '-Wl,-R<(module_root_dir)/build/Release,--enable-new-dtags',
          ],
          'libraries': [
            '-ldl',
          ]
        }],
      ],
      'dependencies': [
        'SDL2_stub_with_needed_name',
      ],
    },
    {
      'target_name': 'SDL2_stub_with_needed_name',
      'type': 'none',
      'dependencies': [
        'SDL2_stub',
      ],
      'actions': [
        {
          'action_name': 'create_link',
          'variables': {
            'stub': [
              '<(module_root_dir)/build/Release/SDL2_stub.so'
            ],
            'link': [
              '<(module_root_dir)/build/Release/libSDL2-2.0.so.0'
            ],
          },
          'inputs': [
            '<@(stub)'
          ],
          'outputs': [
            '<@(link)',
          ],
          'action': ['ln','<@(stub)','<@(link)'],
        },
      ],
    },
    {
      'target_name': 'SDL2_stub',
      'type': 'shared_library',
      'sources': [
        'src/SDL2_stub.cc'
      ],
      'conditions': [
        ['OS=="linux"', {
          'cflags': [
            '-std=c++11',
          ],
        }],
      ],
    },
    {
      'target_name': 'patch_driver_lighthouse',
      'type': 'none',
      'dependencies': [
        'copy_libraries',
      ],
      'actions': [
        {
          'action_name': 'run_patchelf',
          'variables': {
            'driver': [
              '<(module_root_dir)/build/Release/driver_lighthouse.so'
              ],
          },
          'inputs': [
            '<@(driver)'
          ],
          'outputs': [
            'no_output',
          ],
          'action': ['patchelf','--set-rpath','<(module_root_dir)/build/Release','<@(driver)'],
        },
      ],
    },
    {
      'target_name': 'copy_libraries',
      'type': 'none',
      'dependencies': [
        'find_libudev',
      ],
      'copies': [
        {
          'destination': '<(module_root_dir)/build/Release',
          'files': [
            '<(module_root_dir)/files/driver_lighthouse.so',
            '<(module_root_dir)/files/libaitcamlib.so',
            '<(module_root_dir)/files/libudev.so.0',
          ],
        },
      ],
    },
    {
      'target_name': 'find_libudev',
      'type': 'none',
      'actions': [
        {
          'action_name': 'run_script',
          'inputs': [
          ],
          'outputs': [
            '<(module_root_dir)/files/libudev.so.0',
          ],
          'action': ['tools/find-libudev'],
        },
      ],
    },
  ]
}
