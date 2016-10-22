# Vive udev rules

To access devices on linux under udev, you need to provide rules giving yourself permission.  So you create a file, traditionally `/etc/udev/rules.d/83-hmd.rules`, containing some set of rules.

## Rules

Which rules to use?

Arch Linux's [vive-udev](https://aur.archlinux.org/packages/vive-udev/) uses/used [OSVR-Vive-Libre's 83-vive.rules](https://github.com/lubosz/OSVR-Vive-Libre/blob/master/config/83-vive.rules).  As of 2016-09-30, it has only 4 rules, and is not sufficient for general use (they were focused on tracking).

I don't know of any other Vive rule sets being distributed.

Here are the rules I've been successfully using, slightly cleaned up.

    ## HTC Vive udev rules

    ### Issues

    # WARNING: These rules have NOT been reviewed for security.

    # Also, some of them may be unnecessary,
    # have unintended concequences,
    # or be better said in other ways.

    # Not all variants of linux have a "plugdev" group.
    # Debian/Ubuntu does.

    ### Basics

    SUBSYSTEMS=="usb", ATTRS{idVendor}=="0bb4", MODE="0660", GROUP="plugdev"
    SUBSYSTEMS=="usb", ATTRS{idVendor}=="28de", MODE="0660", GROUP="plugdev"

    ### Audio

    # speculative, perhaps unnecessary
    SUBSYSTEMS=="usb", ATTRS{idVendor}=="0d8c", MODE="0660", GROUP="plugdev"

    ### Hub controller

    SUBSYSTEMS=="usb", ATTRS{idVendor}=="0424", ATTRS{idProduct}=="274d", MODE:="0660", GROUP="plugdev"
    KERNEL=="ttyACM*", ATTRS{idVendor}=="0424", ATTRS{idProduct}=="274d", MODE:="0660", GROUP="plugdev"

    #### Hub controller error avoidance

    ATTRS{idVendor}=="0424", ATTRS{idProduct}=="274d", ENV{ID_MM_DEVICE_IGNORE}="1"

    # speculative, perhaps redundant
    ATTRS{idVendor}=="0424", ATTRS{idProduct}=="274d", ENV{MTP_NO_PROBE}="1"

    # syslog:
    # ModemManager[2540]: <info>  Creating modem with plugin 'Generic' and '1' ports
    # ModemManager[2540]: <warn>  Could not grab port (tty/ttyACM0): 'Cannot add port 'tty/ttyACM0', unhandled serial type'
    # ModemManager[2540]: <warn>  Couldn't create modem for device at '/sys/devices/pci0000:00/0000:00:14.0/usb1/1-1/1-1.3': Failed to find primary AT port

    ### Input

    # Based on suggestions for the Steam Controller.

    KERNEL="uinput", MODE="0660", GROUP="plugdev", OPTIONS="static_node=uinput"
    KERNEL="uinput", SUBSYSTEM="misc", TAG+="uaccess"

## Load rules

On Debian/Ubuntu:

    sudo udevadm control --reload-rules

Or just reboot.
